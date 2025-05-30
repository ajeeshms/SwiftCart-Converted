// filename: src\pages\CartPage.tsx
import { useState, useEffect } from 'react';
import { CartItemCard } from '../components/CartItemCard';
import { CartSummary } from '../components/CartSummary';
// Import necessary types from central types file, including OrderDto and the new wrapper
// Removed CreateOrderPayloadWrapper as it's not needed based on backend
// Updated type imports to reflect optional fields
import { CartDto, CartItemDto, ProductDto, AddressDto, OrderDto, OrderItemDto } from '@/types';
import { cartApi, userApi, productApi, orderApi } from '@/services/api'; // Use API services
import { useAuthStore } from '@/stores/authStore'; // Get user ID
import { Loader } from 'lucide-react';
import axios from 'axios'; // Import axios to use isAxiosError

// Extend CartItemDto to include product details needed for display (name, price, image)
// The mapped object in displayedCartItems also adds 'name' and 'price' based on CartItemDto's productName/unitPrice.
// The interface needs to reflect this shape.
interface CartItemWithProductDetails extends CartItemDto {
    imageUrl: string;
    name: string; // Add 'name' property matching CartItemCardProps
    price: number; // Add 'price' property matching CartItemCardProps
    // Potentially add description if needed on cart page
}


function CartPage() {
    const [cart, setCart] = useState<CartDto | null>(null);
    const [loadingCart, setLoadingCart] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [itemDetails, setItemDetails] = useState<{ [productId: string]: ProductDto }>({}); // Store product details fetched separately
    const [loadingItemDetails, setLoadingItemDetails] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null); // Message for checkout process
    const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false); // State for invoice download

    const { user } = useAuthStore(); // Get user for user ID

    // --- Fetch Cart Data ---
    useEffect(() => {
        const fetchCart = async () => {
            // Check if user is logged in and has an ID
            if (!user?.id) {
                // If not logged in, clear cart state and stop loading
                setCart(null);
                setItemDetails({}); // Also clear item details
                setLoadingCart(false);
                setLoadingItemDetails(false);
                setError("Please log in to view your cart."); // Optional: show a message
                return;
            }

            setLoadingCart(true);
            setError(null); // Clear previous errors
            setCheckoutMessage(null); // Clear messages
            try {
                // Use the user ID to fetch the cart
                const response = await cartApi.getCart(user.id);
                setCart(response.data);
            } catch (err: unknown) { // Type the catch variable as unknown
                console.error('Error fetching cart:', err);
                // Check if it's an Axios error to access response properties
                if (axios.isAxiosError(err)) {
                    // If the error is 404 (cart not found for user), treat it as an empty cart
                    if (err.response?.status === 404) {
                        // Provide default empty cart structure with a placeholder ID or null/undefined if backend handles it
                        // Using a placeholder ID for now, adjust if backend expects null/undefined on creation
                        setCart({ id: '', userId: user.id, items: [], totalAmount: 0, totalItems: 0 });
                    } else {
                        setError('Failed to load cart');
                        setCart(null); // Clear cart state on other errors
                    }
                } else {
                    // Handle non-Axios errors
                    setError('An unexpected error occurred while loading the cart.');
                    setCart(null);
                }
            } finally {
                setLoadingCart(false);
            }
        };

        fetchCart();
        // Add user?.id as dependency to refetch if user changes (e.g., login/logout)
    }, [user?.id]);


    // --- Fetch Product Details for Cart Items ---
    // This effect runs when the 'cart' state changes
    useEffect(() => {
        const fetchItemDetails = async () => {
            // If no cart or empty cart, no details to fetch
            if (!cart || cart.items.length === 0) {
                setItemDetails({}); // Clear details
                setLoadingItemDetails(false);
                return;
            }

            setLoadingItemDetails(true);
            // Get unique product IDs from the cart items
            const productIds = cart.items.map(item => item.productId);
            const uniqueProductIds = [...new Set(productIds)];

            const detailsMap: { [productId: string]: ProductDto } = {};
            try {
                // Fetch details for each unique product ID in parallel
                const detailPromisesCorrected = uniqueProductIds.map(id =>
                    // productApi.getById returns AxiosResponse<ProductDto>
                    productApi.getById(id).catch((err: unknown) => { // Type the catch variable
                        console.error(`Failed to fetch details for product ${id}:`, err);
                        return null; // Return null for failed fetches
                    })
                );

                // Wait for all promises to resolve
                const results = await Promise.all(detailPromisesCorrected); // results is (AxiosResponse<ProductDto> | null)[]

                // Process results, accessing the .data property of successful responses
                results.forEach(response => { // 'response' here is AxiosResponse<ProductDto> | null
                    // Check if the response is not null and contains data
                    if (response?.data) { // <-- Access .data here
                        detailsMap[response.data.id] = response.data; // <-- Access .data here
                    }
                });

                setItemDetails(detailsMap);

            } catch (err: unknown) { // Type the catch variable
                console.error('Error fetching item details:', err);
                // Handle errors during parallel fetching if needed
            } finally {
                setLoadingItemDetails(false);
            }
        };

        fetchItemDetails();
        // Depend on cart?.items (deep equality check or hashing recommended for production)
        // Using JSON.stringify for a simple deep comparison dependency
    }, [JSON.stringify(cart?.items)]);


    const handleUpdateQuantity = async (itemId: string, quantity: number) => {
        // Ensure cart and user are available, and quantity is valid (>= 1)
        if (!cart || !user?.id || quantity < 1) return;

        // Find the item and its corresponding product details for stock check
        const itemToUpdate = cart.items.find(item => item.id === itemId);
        const product = itemDetails[itemToUpdate?.productId || '']; // Access from itemDetails state

        // Prevent update if exceeding stock
        if (itemToUpdate && product && quantity > product.stockQuantity) {
            console.warn(`Cannot update quantity to ${quantity} for ${itemToUpdate.productName}: exceeds stock ${product.stockQuantity}`);
            // TODO: Show a toast or message about insufficient stock
            return; // Prevent update if exceeds stock
        }

        // Optionally prevent update if quantity is the same as current
        if (itemToUpdate && itemToUpdate.quantity === quantity) {
            console.log(`Quantity for item ${itemId} is already ${quantity}. No update needed.`);
            return;
        }


        // Optimistically update state for responsiveness
        setCart(currentCart => {
            if (!currentCart) return null; // Should not happen based on checks above, but safety
            const updatedItems = currentCart.items.map(item =>
                item.id === itemId ? { ...item, quantity, totalPrice: item.unitPrice * quantity } : item
            );
            // Recalculate totals optimistically
            const newTotalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
            const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

            return {
                ...currentCart,
                items: updatedItems,
                totalAmount: newTotalAmount,
                totalItems: newTotalItems,
            };
        });


        try {
            // Call the update API
            const response = await cartApi.updateItemQuantity({
                cartId: cart.id, // Pass cart ID from state
                itemId: itemId,
                quantity: quantity,
            });
            // Update state with server response to ensure consistency
            setCart(response.data);
            // TODO: Show success toast
            console.log(`Quantity updated for item ${itemId}`);
        } catch (err: unknown) { // Type the catch variable
            console.error('Error updating item quantity:', err);
            setError('Failed to update item quantity'); // Show error to user
            // Revert optimistic update or refetch cart on API call failure
            // Refetching the cart is simpler here to get the true server state
            if (user?.id) {
                try {
                    const response = await cartApi.getCart(user.id);
                    setCart(response.data);
                } catch (fetchErr: unknown) { // Type the catch variable
                    console.error('Failed to refetch cart after update error', fetchErr);
                    // If refetching fails, maybe set cart to null or show a critical error
                    // setErrorMessage('Failed to update cart and could not refresh state.');
                    setCart(null); // Critical error, reset cart state
                }
            }
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        // Ensure cart and user are available
        if (!cart || !user?.id) return;

        // Optimistically update state
        setCart(currentCart => {
            if (!currentCart) return null; // Should not happen
            const updatedItems = currentCart.items.filter(item => item.id !== itemId);
            // Recalculate totals optimistically
            const newTotalAmount = updatedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
            const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

            return {
                ...currentCart,
                items: updatedItems,
                totalAmount: newTotalAmount,
                totalItems: newTotalItems,
            };
        });

        try {
            // Call the remove API
            const response = await cartApi.removeItem(cart.id, itemId); // Pass cart ID and item ID
            setCart(response.data); // Update state with server response
            // TODO: Show success toast
            console.log(`Item ${itemId} removed from cart`);
        } catch (err: unknown) { // Type the catch variable
            console.error('Error removing item:', err);
            setError('Failed to remove item'); // Show error
            // Refetch cart on error
            if (user?.id) {
                try {
                    const response = await cartApi.getCart(user.id);
                    setCart(response.data);
                } catch (fetchErr: unknown) { // Type the catch variable
                    console.error('Failed to refetch cart after remove error', fetchErr);
                    setCart(null); // Critical error, reset state
                }
            }
        }
    };

    // Function to handle downloading the invoice
    const handleDownloadInvoice = async (orderId: string) => {
        setIsDownloadingInvoice(true);
        setCheckoutMessage("Downloading invoice...");
        setError(null); // Clear previous errors before attempting download
        try {
            // Call the invoice export API, requesting the response as a blob
            const response = await orderApi.exportInvoiceExcel(orderId);

            // If the request was successful (2xx status), response.data should be a Blob.
            // If it's not, it's an unexpected scenario for a successful API call.
            if (!(response.data instanceof Blob)) {
                console.error("Received non-Blob data for successful invoice request.");
                // We cannot reliably read it as text here. Throw a new error to be caught below.
                throw new Error("Received invalid data format from server for invoice.");
            }

            const blob = response.data; // response.data is guaranteed to be a Blob here

            // Get the filename from the response headers if available, otherwise use a default
            // The backend sets the 'content-disposition' header with the filename
            const contentDisposition = response.headers['content-disposition'];
            let filename = `invoice_${orderId}.xlsx`; // Default filename
            if (contentDisposition) {
                // More robust regex for different filename formats (RFC 6266)
                const filenameMatch = contentDisposition.match(/filename\*?=['"](?:UTF-8'')?([^"']*)['"]/i);
                if (filenameMatch && filenameMatch[1]) {
                    // Decode filename if necessary
                    try {
                        filename = decodeURIComponent(filenameMatch[1].replace(/\+/g, ' '));
                    } catch {
                        filename = filenameMatch[1]; // Use raw match if decoding fails
                    }
                } else {
                    // Fallback for basic filename="filename"
                    const basicFilenameMatch = contentDisposition.match(/filename="([^"]*)"/);
                    if (basicFilenameMatch && basicFilenameMatch[1]) {
                        filename = basicFilenameMatch[1];
                    }
                }
            }

            // Create a link element to trigger the download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename; // Set the download attribute with the filename
            document.body.appendChild(a);
            a.click(); // Programmatically click the link to trigger the download

            // Clean up by revoking the object URL after the download starts
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setCheckoutMessage(`Order placed successfully. Invoice "${filename}" downloaded.`);
            // TODO: Show success toast
        } catch (err: unknown) { // This catch block handles Axios errors (non-2xx) or errors thrown in the try block
            console.error('Error downloading invoice:', err);
            let errorMessage = 'Failed to download invoice.';

            if (axios.isAxiosError(err)) {
                if (err.response) {
                    // We received a response, even if non-2xx.
                    // Try to get a message from the error response data if it exists and is not a Blob.
                    // When responseType is 'blob' and status is non-2xx, data *might* contain
                    // the non-Blob error body, or it might be undefined.
                    if (err.response.data && !(err.response.data instanceof Blob)) {
                        // Assume backend error responses are often strings or simple JSON objects
                        const backendData = err.response.data as any; // Use 'any' to access potentially non-standard error structures
                        if (typeof backendData.message === 'string') {
                            errorMessage = `Failed to download invoice: ${backendData.message}`;
                        } else if (typeof backendData.title === 'string') { // Common for ASP.NET Core ValidationProblemDetails
                            errorMessage = `Failed to download invoice: ${backendData.title}`;
                        } else if (typeof backendData === 'string') {
                            // If the backend just returned a plain string error body
                            errorMessage = `Failed to download invoice: ${backendData}`;
                        } else {
                            // Fallback if the data structure is unexpected
                            errorMessage = `Failed to download invoice: Server responded with status ${err.response.status || 'Unknown'}`;
                        }

                    } else if (err.response.status === 404) {
                        errorMessage = "Order not found for invoice."; // More specific for 404 from the API
                    } else {
                        // If response data was a Blob or undefined, fallback to status code or generic message
                        errorMessage = `Failed to download invoice: Server responded with status ${err.response.status || 'Unknown'}`;
                    }
                } else if (err.request) {
                    // The request was made but no response was received (e.g., network error)
                    errorMessage = 'Failed to download invoice: No response received from server.';
                } else {
                    // Something happened in setting up the request that triggered an Error
                    errorMessage = `Failed to download invoice: ${err.message}`;
                }
            } else if (err instanceof Error) {
                // Handle generic JS errors or the error thrown from the try block
                errorMessage = `An unexpected error occurred: ${err.message}`;
            } else {
                errorMessage = 'An unknown error occurred during invoice download.';
            }

            setError(errorMessage); // Use the main error state
            setCheckoutMessage(null); // Clear message on error
            // TODO: Show an error toast notification
        } finally {
            setIsDownloadingInvoice(false);
        }
    };


    const handleCheckout = async () => {
        // Ensure cart has items and user is logged in
        if (!cart || cart.items.length === 0 || !user?.id) {
            console.log("Cart is empty or user not logged in. Cannot checkout.");
            // TODO: Show a message to the user
            setError("Your cart is empty or you are not logged in.");
            return;
        }

        setIsCheckingOut(true);
        setIsDownloadingInvoice(false); // Reset download state
        setError(null); // Clear previous errors
        setCheckoutMessage("Processing checkout...");

        try {
            // 1. Fetch user profile to get the address
            setCheckoutMessage("Fetching your profile information...");
            const userProfileResponse = await userApi.getProfile(user.id);
            const userProfile = userProfileResponse.data;

            // 2. Construct the order payload
            // --- ADDRESS MISMATCH NOTE ---
            // The backend OrderDto expects AddressDto {street, city, state, country, zipCode}.
            // The backend UserDto (fetched by userApi.getProfile) only has a single 'address' string.
            // For demonstration, we'll pass the single address string in the 'street' field
            // and use placeholders for others. This is a known issue based on the provided DTOs
            // and would require backend changes to UserDto/Registration/Update to fix properly.
            const userAddress: AddressDto = {
                street: userProfile.address || '', // Using the single string address here
                city: 'N/A', // Placeholder due to UserDto structure
                state: 'N/A', // Placeholder
                country: 'N/A', // Placeholder
                zipCode: 'N/A', // Placeholder
                // A real application needs structured address fields on the UserDto/registration.
            };

            // Map cart items to order items.
            // OrderItemDto requires id, orderId (backend generates?), productId, productName, etc.
            // Omit 'id' and 'orderId' as the backend should assign these.
            const orderItems: OrderItemDto[] = cart.items.map(item => ({
                // id is omitted, backend will generate
                // orderId is omitted, backend will link to parent order's generated ID
                productId: item.productId,
                productName: item.productName,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
            }));

            // Calculate totals including tax and shipping on the frontend
            const subtotalCalculated = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) || 0;
            const taxRate = 0.1; // 10% tax (example)
            const taxCalculated = subtotalCalculated * taxRate;
            const shippingCalculated = subtotalCalculated > 100 ? 0 : 10; // Free shipping over $100 (example)
            const totalCalculated = subtotalCalculated + taxCalculated + shippingCalculated;


            const orderPayload: OrderDto = {
                // id is omitted, backend will generate
                userId: user.id,
                // orderNumber is omitted, backend will generate
                // Use integer 0 for OrderStatus.Pending, matching payload structure
                status: 0,
                totalAmount: totalCalculated, // Using frontend calculated total including tax/shipping
                items: orderItems,
                shippingAddress: userAddress,
                billingAddress: userAddress, // Assuming same for now
                paymentInfo: { // Placeholder payment info. Needs to match backend PaymentInfoDto
                    transactionId: '00000000-0000-0000-0000-000000000000', // Placeholder
                    // Use integer 0 for PaymentStatus.Pending, matching payload structure
                    status: 0,
                    // Use integer 1 for PaymentMethod.Card (assuming 0 is None), matching payload structure
                    method: 1,
                    // Assign undefined instead of null for optional properties
                    paidAt: undefined, // Use undefined instead of null
                },
                createdAt: new Date().toISOString(), // Client-side timestamp (backend might ignore/overwrite)
                // Assign undefined instead of null for optional properties
                updatedAt: undefined, // Use undefined instead of null
            };


            // 3. Call the order API to create the order using the *unwrapped* payload
            setCheckoutMessage("Creating your order...");
            // Send the orderPayload directly, omitting generated fields
            const orderResponse = await orderApi.create(orderPayload); // Send orderPayload directly
            console.log('Order created:', orderResponse.data);
            const createdOrderId = orderResponse.data.id; // Get the ID of the newly created order

            // 4. Trigger invoice download immediately after order creation
            if (createdOrderId) {
                await handleDownloadInvoice(createdOrderId);
            } else {
                setCheckoutMessage("Order placed, but could not retrieve order ID for invoice download.");
                // TODO: Show warning toast
            }


            // 5. Clear the cart after successful checkout (Optional, but common)
            // Need the cart ID to clear it
            if (cart.id) { // Check if cart has a valid ID (it should after fetching, unless it was initially empty)
                await cartApi.clearCart(cart.id);
            }
            // Always clear frontend cart state after attempting checkout
            setCart({ id: cart?.id || '', userId: user.id, items: [], totalAmount: 0, totalItems: 0 }); // Keep existing ID if it existed
            setItemDetails({}); // Also clear item details state

            // Checkout message is handled by handleDownloadInvoice now
            // setCheckoutMessage("Order placed successfully!"); // Only if download wasn't triggered or failed


        } catch (err: unknown) { // Type the catch variable
            console.error('Error during checkout:', err);
            // Check if it's an Axios error to provide more specific feedback
            if (axios.isAxiosError(err)) {
                // Example: handle specific backend error responses
                // For 400 validation errors, the data might have the 'errors' structure
                const backendErrorData = err.response?.data;
                let backendErrorMessage = 'An error occurred during checkout.';

                if (backendErrorData && typeof backendErrorData === 'object') {
                    // Try to get a top-level message
                    if ((backendErrorData as any).message) {
                        backendErrorMessage = (backendErrorData as any).message;
                    } else if ((backendErrorData as any).title) {
                        // Often validation errors have a 'title'
                        backendErrorMessage = (backendErrorData as any).title;
                    } else if ((backendErrorData as any).errors && typeof (backendErrorData as any).errors === 'object') {
                        // Try to extract specific validation errors
                        const validationErrors = (backendErrorData as any).errors;
                        const firstErrorKey = Object.keys(validationErrors)[0];
                        if (firstErrorKey && Array.isArray(validationErrors[firstErrorKey]) && validationErrors[firstErrorKey].length > 0) {
                            backendErrorMessage = `Validation Error: ${validationErrors[firstErrorKey][0]}`;
                        }
                    } else {
                        // Fallback if structure is unexpected
                        backendErrorMessage = 'Received an unexpected error response from the server.';
                    }
                } else if (typeof backendErrorData === 'string') {
                    backendErrorMessage = backendErrorData; // Sometimes just a string
                } else {
                    // If no response data or non-Axios error structure
                    backendErrorMessage = err.message || 'An unknown error occurred.';
                }


                setError(`Checkout failed: ${backendErrorMessage}`);
            } else {
                setError('Checkout failed. An unexpected error occurred.');
            }
            setCheckoutMessage(null); // Clear message on error
            // TODO: Show an error toast notification
        } finally {
            setIsCheckingOut(false);
            // setIsDownloadingInvoice state is handled by handleDownloadInvoice's finally block
        }
    };


    // Prepare items for display, combining cart item data with product details
    // Ensure we use item's price/name/quantity for display and calculations in summary
    const displayedCartItems: CartItemWithProductDetails[] = cart?.items
        .map(item => {
            // Find the corresponding product details
            const productDetail = itemDetails[item.productId];
            return {
                ...item, // Spread CartItemDto properties (id, cartId, productId, productName, unitPrice, quantity, totalPrice)
                // Add properties needed for CartItemCard and display that aren't explicitly in CartItemDto
                imageUrl: productDetail?.imageUrl || '/placeholder-image.png', // Use fetched image or a placeholder
                // Explicitly set name and price for the Card component to match CartItemCardProps
                name: item.productName, // Use productName from CartItemDto
                price: item.unitPrice, // Use unitPrice from CartItemDto
                // Note: The type interface CartItemWithProductDetails now includes 'name' and 'price'
            } as CartItemWithProductDetails; // Cast to ensure type correctness after mapping
        })
        // Optional: filter out items where product details (like image) failed to load,
        // or provide a placeholder/error state in the CartItemCard itself.
        // Only filter out if imageUrl is explicitly the placeholder, allowing items where product details might be partially missing
        // .filter(item => item.imageUrl !== '/placeholder-image.png') // Decide if you want to show items with missing details
        || []; // Default to empty array if cart or items are null


    // Calculate summary values from the cart state's items array
    // Use the unitPrice and quantity from the CartItemDto for calculations
    const subtotal = cart?.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) || 0;
    const taxRate = 0.1; // 10% tax (example)
    const tax = subtotal * taxRate;
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100 (example)
    const total = subtotal + tax + shipping;


    // Show loading state while fetching cart or item details
    if (loadingCart || loadingItemDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-700">Loading cart...</span>
            </div>
        );
    }

    // Show error state if fetching cart failed critically AND we are not currently trying to checkout/download
    // This distinguishes initial load errors from checkout errors
    if (error && !loadingCart && !loadingItemDetails && !isCheckingOut && !isDownloadingInvoice) { // Ensure we only show error after loading attempts finish
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

            {/* Show message if user is not logged in */}
            {!user?.id && (
                <div className="text-center py-12">
                    <p className="text-gray-600">Please log in to view your cart.</p>
                </div>
            )}

            {/* Show cart contents only if user is logged in AND cart items exist */}
            {/* Add check for user?.id here as well */}
            {user?.id && displayedCartItems.length === 0 && !loadingCart && !loadingItemDetails && !error && !isCheckingOut && !isDownloadingInvoice && (
                <div className="text-center py-12">
                    <p className="text-gray-600">Your cart is empty</p>
                </div>
            )}

            {/* Display checkout loading state and messages */}
            {(isCheckingOut || isDownloadingInvoice) && (
                <div className="flex flex-col items-center justify-center mt-8 mb-8">
                    {/* Only show spinner if something is actively happening */}
                    {(isCheckingOut || isDownloadingInvoice) && <Loader className="h-8 w-8 animate-spin text-blue-600 mb-2" />}
                    <span className="ml-2 text-gray-700">{checkoutMessage || (isCheckingOut ? 'Processing Checkout...' : 'Downloading Invoice...')}</span>
                    {/* Optional: Display error specific to checkout/download if they failed AFTER a successful cart load */}
                    {/* Move this error display below the summary for better context */}
                </div>
            )}


            {/* Show the cart layout ONLY when not loading, user is logged in, there are items, AND NOT actively checking out/downloading */}
            {user?.id && displayedCartItems.length > 0 && !loadingCart && !loadingItemDetails && !(isCheckingOut || isDownloadingInvoice) && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {displayedCartItems.map(item => (
                            <CartItemCard
                                key={item.id} // Use CartItem ID as key
                                id={item.id} // Pass CartItem ID for update/remove handlers
                                name={item.name} // Pass mapped 'name'
                                price={item.price} // Pass mapped 'price'
                                quantity={item.quantity}
                                imageUrl={item.imageUrl} // Pass mapped 'imageUrl'
                                onUpdateQuantity={handleUpdateQuantity}
                                onRemove={handleRemoveItem}
                            />
                        ))}
                    </div>

                    <div>
                        <CartSummary
                            subtotal={subtotal}
                            tax={tax}
                            shipping={shipping}
                            total={total}
                            onCheckout={handleCheckout}
                        />
                        {/* Display specific errors related to cart updates or checkout initiation below the summary */}
                        {error && !isCheckingOut && !isDownloadingInvoice && (
                            <p className="text-sm text-red-600 mt-4 text-center">{error}</p>
                        )}
                        {/* Display errors specific to checkout/download here if they failed */}
                        {error && (isCheckingOut || isDownloadingInvoice) && (
                            <p className="text-sm text-red-600 mt-4 text-center">{error}</p>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}

export default CartPage;
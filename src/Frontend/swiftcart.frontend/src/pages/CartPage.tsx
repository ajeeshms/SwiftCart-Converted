// filename: src\pages\CartPage.tsx
import { useState, useEffect } from 'react';
import { CartItemCard } from '../components/CartItemCard';
import { CartSummary } from '../components/CartSummary';
// Import necessary types from central types file, including OrderDto
import { CartDto, CartItemDto, ProductDto, AddressDto, OrderDto } from '@/types';
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

    const handleCheckout = async () => {
        // Ensure cart has items and user is logged in
        if (!cart || cart.items.length === 0 || !user?.id) {
            console.log("Cart is empty or user not logged in. Cannot checkout.");
            // TODO: Show a message to the user
            return;
        }

        setIsCheckingOut(true);
        setError(null); // Clear previous errors

        try {
            // 1. Fetch user profile to get the address
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
            // Use '000...' for ID placeholders where backend should assign.
            const orderItems = cart.items.map(item => ({
                id: '00000000-0000-0000-0000-000000000000', // Placeholder ID, backend should assign
                orderId: '00000000-0000-0000-0000-000000000000', // Placeholder, backend should assign
                productId: item.productId,
                productName: item.productName,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
            }));

            // Calculate totals including tax and shipping on the frontend
            const subtotalCalculated = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
            const taxRate = 0.1; // 10% tax (example)
            const taxCalculated = subtotalCalculated * taxRate;
            const shippingCalculated = subtotalCalculated > 100 ? 0 : 10; // Free shipping over $100 (example)
            const totalCalculated = subtotalCalculated + taxCalculated + shippingCalculated;


            const orderPayload: OrderDto = {
                id: '00000000-0000-0000-0000-000000000000', // Placeholder ID, backend should assign
                userId: user.id,
                orderNumber: '', // Placeholder, backend should assign
                status: 'Pending', // Initial status. Ensure this string matches backend OrderStatus enum name or expected string value.
                totalAmount: totalCalculated, // Using frontend calculated total including tax/shipping
                items: orderItems,
                shippingAddress: userAddress,
                billingAddress: userAddress, // Assuming same for now
                paymentInfo: { // Placeholder payment info. Needs to match backend PaymentInfoDto
                    transactionId: '00000000-0000-0000-0000-000000000000', // Placeholder
                    status: 'Pending', // Initial payment status. Ensure this string matches backend PaymentStatus.
                    method: 'Card', // Placeholder. Ensure this string matches backend PaymentMethod.
                    // Assign undefined instead of null for optional properties
                    paidAt: undefined, // Use undefined instead of null
                },
                createdAt: new Date().toISOString(), // Client-side timestamp (backend might ignore/overwrite)
                // Assign undefined instead of null for optional properties
                updatedAt: undefined, // Use undefined instead of null
            };

            // 3. Call the order API to create the order
            const orderResponse = await orderApi.create(orderPayload);
            console.log('Order created:', orderResponse.data);
            // Assume the response contains the final order details including generated IDs, order number, etc.

            // 4. Clear the cart after successful checkout (Optional, but common)
            // Need the cart ID to clear it
            if (cart.id) { // Check if cart has a valid ID (it should after fetching, unless it was initially empty)
                await cartApi.clearCart(cart.id);
            }
            // Always clear frontend cart state after attempting checkout
            setCart({ id: cart?.id || '', userId: user.id, items: [], totalAmount: 0, totalItems: 0 }); // Keep existing ID if it existed
            setItemDetails({}); // Also clear item details state


            // TODO: Show a success toast/message and navigate to order confirmation page
            // import { useNavigate } from 'react-router-dom';
            // const navigate = useNavigate();
            // navigate(`/order-confirmation/${orderResponse.data.id}`);

        } catch (err: unknown) { // Type the catch variable
            console.error('Error during checkout:', err);
            // Check if it's an Axios error to provide more specific feedback
            if (axios.isAxiosError(err)) {
                // Example: handle specific backend error responses
                const backendErrorMessage = err.response?.data?.message || 'An error occurred during checkout.';
                setError(`Checkout failed: ${backendErrorMessage}`);
            } else {
                setError('Checkout failed. An unexpected error occurred.');
            }
            // TODO: Show an error toast notification
        } finally {
            setIsCheckingOut(false);
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
        .filter(item => !!item.imageUrl && item.imageUrl !== '/placeholder-image.png') // Filter out items without an image
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

    // Show error state if fetching cart failed critically
    if (error && !loadingCart && !loadingItemDetails) { // Ensure we only show error after loading attempts finish
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
            {user?.id && displayedCartItems.length === 0 && !loadingCart && !loadingItemDetails && !error && (
                <div className="text-center py-12">
                    <p className="text-gray-600">Your cart is empty</p>
                </div>
            )}

            {user?.id && displayedCartItems.length > 0 && (
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
                    </div>
                </div>
            )}

            {/* Display checkout loading state */}
            {isCheckingOut && (
                <div className="flex justify-center mt-8">
                    <Loader className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-700">Processing Checkout...</span>
                </div>
            )}
        </div>
    );
}

export default CartPage;
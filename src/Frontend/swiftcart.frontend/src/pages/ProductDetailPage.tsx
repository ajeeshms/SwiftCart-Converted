// filename: src\pages\ProductDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, Loader } from 'lucide-react';
import * as productService from '@/services/productService'; // Use service layer
import { cartApi } from '@/services/api'; // Use api layer for direct calls
// Import ProductDto and the updated AddItemPayload type
import { ProductDto, AddItemPayload } from '@/types';
import { useAuthStore } from '@/stores/authStore'; // Get user ID
import axios, { AxiosError } from 'axios'; // Import axios and AxiosError for type guarding

function ProductDetailPage() {
    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<ProductDto | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // General error for page load
    const [addToCartError, setAddToCartError] = useState<string | null>(null); // Specific error for add to cart
    const [isAddingToCart, setIsAddingToCart] = useState(false); // State for add to cart loading

    const { user, isAuthenticated } = useAuthStore(); // Get user for cart

    useEffect(() => {
        async function loadProduct() {
            try {
                if (!productId) {
                    setError('Product ID is missing');
                    setIsLoading(false);
                    return;
                };
                setIsLoading(true);
                setError(null); // Clear general error
                setAddToCartError(null); // Clear add to cart error
                // Use the corrected productService which uses the updated api instance
                const data = await productService.getById(productId);
                setProduct(data);
                // Reset quantity if product changes (e.g., navigating between details)
                setQuantity(1);
            } catch (err) {
                console.error("Failed to load product:", err);
                setError('Failed to load product details');
            } finally {
                setIsLoading(false);
            }
        }

        loadProduct();
    }, [productId]); // Depend on productId

    const handleQuantityChange = (delta: number) => {
        if (!product) return;
        const newQuantity = quantity + delta;
        // Check against stockQuantity
        if (newQuantity >= 1 && newQuantity <= product.stockQuantity) {
            setQuantity(newQuantity);
        }
        // Clear specific error related to quantity/stock if changed
        if (addToCartError) {
            setAddToCartError(null);
        }
    };

    const handleAddToCart = async () => {
        if (!product || !user) {
            // This should ideally not happen if isAuthenticated check is done first
            console.warn("Cannot add to cart: Product data missing or user not available.");
            setAddToCartError("Internal error: Missing product or user data.");
            return;
        }

        if (!isAuthenticated) {
            console.log("User not authenticated. Cannot add to cart.");
            // This case should be handled by the disabled state and message, not an error toast
            return;
        }

        if (quantity > product.stockQuantity) {
            // This case should be handled by the disabled state and message, not an error toast
            setAddToCartError("Cannot add quantity exceeding available stock.");
            return;
        }


        setIsAddingToCart(true);
        setAddToCartError(null); // Clear previous errors specific to adding item

        try {
            // Construct the payload matching the AddItemCommand structure expected by the backend
            // Frontend now sends ONLY identifiers and quantity
            const cartItemData: AddItemPayload = {
                userId: user.id, // Use user ID from auth store (Guid on backend)
                productId: product.id, // Use product ID (Guid on backend)
                quantity: quantity, // Current selected quantity (int on backend)
                // productName and unitPrice are REMOVED from here,
                // as the Cart service will fetch them from the Product service.
            };

            // Call the cart API to add the item
            await cartApi.addItem(cartItemData);
            console.log(`Added ${quantity} of ${product.name} to cart for user ${user.id}`);
            // TODO: Show a success toast notification
            // Example: showToast('success', `${quantity} of "${product.name}" added to cart!`);

        } catch (err) {
            console.error("Failed to add item to cart:", err);
            // Determine a user-friendly error message
            let errorMessage = 'Failed to add item to cart. Please try again.';

            // Use axios.isAxiosError for better type guarding of Axios errors
            if (axios.isAxiosError(err)) {
                // The err.response property is now correctly typed if it exists
                if (err.response?.data) {
                    // Cast err.response.data to a type that might contain 'message' or 'errors'
                    const backendData = err.response.data as { message?: string; errors?: any };

                    if (typeof backendData.message === 'string') {
                        // If there's a top-level 'message' property
                        errorMessage = `Failed to add item: ${backendData.message}`;
                    } else if (backendData.errors && typeof backendData.errors === 'object') {
                        // It's likely a validation error object (common for 400 status)
                        // Attempt to extract the first validation error message
                        const firstErrorKey = Object.keys(backendData.errors)[0];
                        if (firstErrorKey) {
                            const firstErrorMessageArray = backendData.errors[firstErrorKey];
                            if (Array.isArray(firstErrorMessageArray) && typeof firstErrorMessageArray[0] === 'string') {
                                errorMessage = `Failed to add item: ${firstErrorMessageArray[0]}`;
                            } else {
                                // Fallback if 'errors' structure is unexpected
                                errorMessage = `Failed to add item: Validation failed.`;
                            }
                        } else {
                            // Fallback if 'errors' object is empty but exists
                            errorMessage = `Failed to add item: Validation failed.`;
                        }
                    } else {
                        // Fallback if response data exists but doesn't match expected error structures
                        errorMessage = `Failed to add item: Received unexpected response from server.`;
                    }
                } else if (err.request) {
                    // The request was made but no response was received (e.g., network error)
                    errorMessage = 'Failed to add item: No response received from server.';
                } else {
                    // Something happened in setting up the request that triggered an Error
                    errorMessage = `Failed to add item: ${err.message}`;
                }
            } else if (err instanceof Error) {
                // Handle non-Axios errors (e.g., errors thrown in synchronous code)
                errorMessage = `An unexpected error occurred: ${err.message}`;
            }
            // If err was null, undefined, or not an object, the initial checks fail, default errorMessage is used.

            setAddToCartError(errorMessage); // Set the specific add to cart error state
            // TODO: Show an error toast notification using your toast system
            // Example: showToast('error', errorMessage);

        } finally {
            setIsAddingToCart(false);
        }
    };


    // Use the general error state for initial page load failure
    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center"> {/* Adjust height for header */}
                <Loader className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-700">Loading product...</span>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center"> {/* Adjust height for header */}
                <div className="text-center">
                    {/* Use the general error message */}
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
                    <p className="text-gray-600">{error || 'Product not found'}</p>
                </div>
            </div>
        );
    }

    // Check conditions for enabling the add to cart button
    const isQuantityValid = quantity > 0 && quantity <= product.stockQuantity;
    const canAddToCart = isAuthenticated && product.stockQuantity > 0 && !isAddingToCart && isQuantityValid;

    // Determine why it's disabled for display message on the button
    let addToCartButtonText = 'Add to Cart';
    if (isAddingToCart) {
        addToCartButtonText = 'Adding...';
    } else if (!isAuthenticated) {
        addToCartButtonText = 'Please log in to add to cart';
    } else if (product.stockQuantity === 0) {
        addToCartButtonText = 'Out of Stock';
    } else if (!isQuantityValid) {
        addToCartButtonText = 'Invalid Quantity';
    }


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-square overflow-hidden rounded-lg">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                        <p className="text-lg text-gray-500">{product.category}</p>
                    </div>

                    <p className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</p>

                    <div className="prose prose-blue max-w-none">
                        <p>{product.description}</p>
                    </div>

                    <div className="border-t border-b py-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">Stock</span>
                            <span className={`font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {product.stockQuantity > 0 ? `${product.stockQuantity} units available` : 'Out of stock'}
                            </span>
                        </div>
                        {/* Display quantity validation error here */}
                        {product.stockQuantity > 0 && quantity > product.stockQuantity && (
                            <p className="text-sm text-red-500 mt-2">Quantity exceeds available stock.</p>
                        )}
                        {product.stockQuantity > 0 && quantity <= 0 && (
                            <p className="text-sm text-red-500 mt-2">Quantity must be at least 1.</p>
                        )}
                    </div>

                    {/* Quantity Selector only if in stock */}
                    {product.stockQuantity > 0 && (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border rounded-lg">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                    className="p-2 hover:bg-gray-100 disabled:opacity-50"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-4">{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= product.stockQuantity}
                                    className="p-2 hover:bg-gray-100 disabled:opacity-50"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}


                    <button
                        onClick={handleAddToCart} // Add click handler
                        disabled={!canAddToCart} // Disable based on combined conditions
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAddingToCart ? (
                            <Loader className="h-5 w-5 animate-spin" />
                        ) : (
                            <ShoppingCart className="h-5 w-5" />
                        )}
                        {addToCartButtonText} {/* Use determined button text */}
                    </button>
                    {/* Display specific reasons for disabling *below* the button if needed, beyond button text*/}
                    {(!isAuthenticated || product.stockQuantity === 0) && (
                        <p className="text-sm text-gray-600 text-center">
                            {addToCartButtonText} {/* Re-display or refine this message */}
                        </p>
                    )}
                    {/* Display the specific add-to-cart error */}
                    {addToCartError && !isAddingToCart && (
                        <p className="text-sm text-red-600 text-center mt-2">{addToCartError}</p>
                    )}


                    <div className="border-t pt-6">
                        <dl className="grid grid-cols-1 gap-y-4">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Product ID</dt>
                                <dd className="mt-1 text-sm text-gray-900">{product.id}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Added</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {new Date(product.createdAt).toLocaleDateString()}
                                </dd>
                            </div>
                            {product.updatedAt && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {new Date(product.updatedAt).toLocaleDateString()}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;
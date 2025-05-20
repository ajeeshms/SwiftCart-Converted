import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, Loader } from 'lucide-react';
import * as productService from '@/services/productService';
import { ProductDto } from '@/types';

function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        if (!productId) return;
        setIsLoading(true);
        setError(null);
        const data = await productService.getById(productId);
        setProduct(data);
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && (!product || newQuantity <= product.stockQuantity)) {
      setQuantity(newQuantity);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error || 'Product not found'}</p>
        </div>
      </div>
    );
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
          </div>
          
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
          
          <button
            disabled={product.stockQuantity === 0}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-5 w-5" />
            {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

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
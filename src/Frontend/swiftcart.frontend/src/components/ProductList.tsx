import { useState, useEffect } from 'react';
import { ProductGrid } from './ProductGrid';
import { productApi } from '@/services/api';
import { ProductDto } from '@/types';
import { Loader } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

export function ProductList() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  const loadProducts = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const response = await productApi.getAll(page);
      const newProducts = response.data;
      
      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inView) {
      loadProducts();
    }
  }, [inView]);

  return (
    <div className="space-y-8">
      <ProductGrid products={products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        description: product.description
      }))} />
      
      <div ref={ref} className="h-10 w-full">
        {loading && (
          <div className="flex justify-center py-4">
            <Loader className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}
        {!hasMore && products.length > 0 && (
          <p className="text-center text-gray-600">No more products to load</p>
        )}
      </div>
    </div>
  );
}
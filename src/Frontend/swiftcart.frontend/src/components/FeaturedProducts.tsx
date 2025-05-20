import { ProductGrid } from './ProductGrid';

const FEATURED_PRODUCTS = [
  {
    id: '1',
    name: 'Wireless Earbuds',
    price: 99.99,
    imageUrl: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg',
    description: 'High-quality wireless earbuds with noise cancellation'
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    imageUrl: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
    description: 'Feature-rich smartwatch with health tracking'
  },
  {
    id: '3',
    name: 'Laptop Stand',
    price: 49.99,
    imageUrl: 'https://images.pexels.com/photos/7974/pexels-photo.jpg',
    description: 'Ergonomic laptop stand for better posture'
  }
];

export function FeaturedProducts() {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
      <ProductGrid products={FEATURED_PRODUCTS} />
    </div>
  );
}
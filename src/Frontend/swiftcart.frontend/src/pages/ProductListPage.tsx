import { useState } from 'react';
import { ProductGrid } from '../components/ProductGrid';
import { Search, Filter } from 'lucide-react';

const SAMPLE_PRODUCTS = [
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

function ProductListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'electronics', 'accessories', 'gadgets'];

  const filteredProducts = SAMPLE_PRODUCTS.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === 'all' || product.category === selectedCategory)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <ProductGrid products={filteredProducts} />
    </div>
  );
}

export default ProductListPage;
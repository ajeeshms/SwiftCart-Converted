import { ProductGrid } from '../components/ProductGrid';
import { Trash2 } from 'lucide-react';

const SAMPLE_WISHLIST = [
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
  }
];

function WishlistPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Wishlist</h1>
        <button
          className="flex items-center gap-2 text-red-600 hover:text-red-700"
          onClick={() => {
            // TODO: Implement clear wishlist functionality
            console.log('Clearing wishlist');
          }}
        >
          <Trash2 className="h-5 w-5" />
          Clear Wishlist
        </button>
      </div>

      {SAMPLE_WISHLIST.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Your wishlist is empty</p>
        </div>
      ) : (
        <ProductGrid products={SAMPLE_WISHLIST} />
      )}
    </div>
  );
}

export default WishlistPage;
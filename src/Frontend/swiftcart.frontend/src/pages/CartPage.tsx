import { useState } from 'react';
import { CartItemCard } from '../components/CartItemCard';
import { CartSummary } from '../components/CartSummary';

const SAMPLE_CART_ITEMS = [
  {
    id: '1',
    name: 'Wireless Earbuds',
    price: 99.99,
    quantity: 1,
    imageUrl: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg'
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    quantity: 1,
    imageUrl: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg'
  }
];

function CartPage() {
  const [cartItems, setCartItems] = useState(SAMPLE_CART_ITEMS);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;

  const handleCheckout = () => {
    // TODO: Implement checkout functionality
    console.log('Proceeding to checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Your cart is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <CartItemCard
                key={item.id}
                {...item}
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
    </div>
  );
}

export default CartPage;
import { Heart } from 'lucide-react';
import { useState } from 'react';
import './WishlistButton.css';

type WishlistButtonProps = {
  productId: string;
  isInWishlist: boolean;
  onToggle: (productId: string) => void;
};

export function WishlistButton({ productId, isInWishlist, onToggle }: WishlistButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onToggle(productId);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <button
      onClick={handleClick}
      className={`wishlist-button p-2 rounded-full hover:bg-gray-100 ${
        isAnimating ? 'animate-pop' : ''
      }`}
    >
      <Heart
        className={`h-6 w-6 transition-colors ${
          isInWishlist ? 'text-red-500 fill-current' : 'text-gray-400'
        }`}
      />
    </button>
  );
}
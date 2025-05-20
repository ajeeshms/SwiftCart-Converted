import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
};

export function ProductCard({ id, name, price, imageUrl, description }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link to={`/products/${id}`}>
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/products/${id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">${price.toFixed(2)}</span>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Heart className="h-5 w-5 text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
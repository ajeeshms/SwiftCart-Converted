import { Minus, Plus, Trash2 } from 'lucide-react';

type CartItemCardProps = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
};

export function CartItemCard({
  id,
  name,
  price,
  quantity,
  imageUrl,
  onUpdateQuantity,
  onRemove,
}: CartItemCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
      <img src={imageUrl} alt={name} className="w-20 h-20 object-cover rounded" />
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-600">${price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(id, quantity - 1)}
          disabled={quantity <= 1}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center">{quantity}</span>
        <button
          onClick={() => onUpdateQuantity(id, quantity + 1)}
          className="p-1 rounded hover:bg-gray-100"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <button
        onClick={() => onRemove(id)}
        className="p-2 text-red-500 hover:bg-red-50 rounded"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}
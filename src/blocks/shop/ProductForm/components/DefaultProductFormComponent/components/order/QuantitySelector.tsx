import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (value: number) => void;
  isPending: boolean;
  errors?: { quantity?: string[] };
}

export function QuantitySelector({ quantity, onChange, isPending, errors }: QuantitySelectorProps) {
  const handleQuantityChange = (increment: boolean) => {
    onChange(increment ? quantity + 1 : Math.max(1, quantity - 1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 1;
    onChange(value);
  };

  return (
    <div>
      <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">
        Količina
      </Label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <button
          type="button"
          onClick={() => handleQuantityChange(false)}
          disabled={isPending}
          className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
        >
          <Minus className="h-4 w-4" />
        </button>
        <Input
          type="number"
          id="quantity"
          name="quantity"
          value={quantity}
          onChange={handleInputChange}
          min="1"
          required
          disabled={isPending}
          className="flex-1 text-center border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
        />
        <button
          type="button"
          onClick={() => handleQuantityChange(true)}
          disabled={isPending}
          className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {errors?.quantity && (
        <p className="mt-1 text-xs text-red-600">{errors.quantity[0]}</p>
      )}
    </div>
  );
} 
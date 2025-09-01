import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddressFormProps {
  streetAddress: string;
  postalCode: string;
  town: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isPending: boolean;
  errors?: {
    streetAddress?: string[];
    postalCode?: string[];
    town?: string[];
  };
}

export function AddressForm({ 
  streetAddress, 
  postalCode, 
  town, 
  onChange,
  isPending,
  errors 
}: AddressFormProps) {
  return (
    <>
      <div>
        <Label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700">
          Naslov
        </Label>
        <Input
          type="text"
          id="streetAddress"
          name="streetAddress"
          value={streetAddress}
          onChange={onChange}
          placeholder="Ulica in hišna številka"
          required
          disabled={isPending}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
          aria-invalid={!!errors?.streetAddress}
          aria-describedby="streetAddress-error"
        />
        {errors?.streetAddress && (
          <p id="streetAddress-error" className="mt-1 text-xs text-red-600">{errors.streetAddress[0]}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
            Poštna številka
          </Label>
          <Input
            type="text"
            id="postalCode"
            name="postalCode"
            value={postalCode}
            onChange={onChange}
            placeholder="npr. 1000"
            required
            disabled={isPending}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
            aria-invalid={!!errors?.postalCode}
            aria-describedby="postalCode-error"
          />
          {errors?.postalCode && (
            <p id="postalCode-error" className="mt-1 text-xs text-red-600">{errors.postalCode[0]}</p>
          )}
        </div>
        <div>
          <Label htmlFor="town" className="block text-sm font-medium text-gray-700">
            Kraj
          </Label>
          <Input
            type="text"
            id="town"
            name="town"
            value={town}
            onChange={onChange}
            placeholder="npr. Ljubljana"
            required
            disabled={isPending}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
            aria-invalid={!!errors?.town}
            aria-describedby="town-error"
          />
          {errors?.town && (
            <p id="town-error" className="mt-1 text-xs text-red-600">{errors.town[0]}</p>
          )}
        </div>
      </div>
    </>
  );
} 
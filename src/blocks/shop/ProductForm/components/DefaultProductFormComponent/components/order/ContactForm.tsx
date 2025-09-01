import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ContactFormProps {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isPending: boolean;
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    phone?: string[];
  };
}

export function ContactForm({ 
  firstName, 
  lastName, 
  email, 
  phone, 
  onChange,
  isPending,
  errors 
}: ContactFormProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            Ime
          </Label>
          <Input
            type="text"
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={onChange}
            placeholder="Vnesi ime"
            required
            disabled={isPending}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
            aria-invalid={!!errors?.firstName}
            aria-describedby="firstName-error"
          />
          {errors?.firstName && (
            <p id="firstName-error" className="mt-1 text-xs text-red-600">{errors.firstName[0]}</p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Priimek
          </Label>
          <Input
            type="text"
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={onChange}
            placeholder="Vnesi priimek"
            required
            disabled={isPending}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
            aria-invalid={!!errors?.lastName}
            aria-describedby="lastName-error"
          />
          {errors?.lastName && (
            <p id="lastName-error" className="mt-1 text-xs text-red-600">{errors.lastName[0]}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
          E-poštni naslov <span className="text-red-500">*</span>
        </Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Vnesi e-pošto"
          required
          disabled={isPending}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
          aria-invalid={!!errors?.email}
          aria-describedby="email-error"
        />
        {errors?.email && (
          <p id="email-error" className="mt-1 text-xs text-red-600">{errors.email[0]}</p>
        )}
      </div>

      <div>
        <Label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Telefonska številka <span className="text-gray-500 text-xs">(Opcijsko)</span>
        </Label>
        <Input
          type="tel"
          id="phone"
          name="phone"
          value={phone}
          onChange={onChange}
          placeholder="Vnesi telefonsko številko"
          disabled={isPending}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
          aria-invalid={!!errors?.phone}
          aria-describedby="phone-error"
        />
        {errors?.phone && (
          <p id="phone-error" className="mt-1 text-xs text-red-600">{errors.phone[0]}</p>
        )}
      </div>
    </>
  );
} 
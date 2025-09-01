import React from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface StatusMessageProps {
  message: string;
  success: boolean;
}

export function StatusMessage({ message, success }: StatusMessageProps) {
  if (!message) return null;
  
  if (success) {
    return (
      <Alert>
        <Check className="h-4 w-4" />
        <AlertTitle>Uspeh</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Napaka</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
} 
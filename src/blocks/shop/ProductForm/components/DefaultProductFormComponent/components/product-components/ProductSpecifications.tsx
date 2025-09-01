import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@payload-types';

interface ProductSpecificationsProps {
    product: Product;
    formatBoolean: (value: boolean | undefined | null) => string;
}

export default function ProductSpecifications({ product, formatBoolean }: ProductSpecificationsProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Specifikacije</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>{formatBoolean(product.mountingIncluded)}</div>
                </div>
            </CardContent>
        </Card>
    );
} 
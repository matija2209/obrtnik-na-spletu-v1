import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product } from '@payload-types';
import ProductDescription from './ProductDescription';
import ProductDetailedSpecifications from './ProductDetailedSpecifications';

interface ProductTabsProps {
    product: Product;
    formatBoolean: (value: boolean | undefined | null) => string;
}

export default function ProductTabs({ product, formatBoolean }: ProductTabsProps) {
    return (
        <div className="mt-12">
            <Tabs defaultValue="description">
                <TabsList className="w-full grid grid-cols-1 sm:grid-cols-3 mb-8 max-w-md mx-auto">
                    <TabsTrigger value="description">Opis</TabsTrigger>
                    <TabsTrigger value="specifications">Specifikacije</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="p-4 prose max-w-none">
                    <h3 className="text-xl font-semibold mb-4">Opis izdelka</h3>
                    <ProductDescription product={product} />
                </TabsContent>

                <TabsContent value="specifications" className="p-4">
                    <ProductDetailedSpecifications product={product} formatBoolean={formatBoolean} />
                </TabsContent>
            </Tabs>
        </div>
    );
} 
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@payload-types';

interface ProductDetailedSpecificationsProps {
    product: Product;
    formatBoolean: (value: boolean | undefined | null) => string;
}

export default function ProductDetailedSpecifications({ product, formatBoolean }: ProductDetailedSpecificationsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Podrobne specifikacije</CardTitle>
            </CardHeader>
            <CardContent>
                <table className="w-full text-sm">
                    <tbody>
                        <tr className="border-b">
                            <td className="py-2 font-medium pr-4">Naziv</td>
                            <td className="py-2">{product.title}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 font-medium pr-4">Šifra (SKU)</td>
                            <td className="py-2">{product.sku || 'N/A'}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 font-medium pr-4">Cena</td>
                            <td className="py-2">€{product.price?.toFixed(2)}</td>
                        </tr>
                        {/* {product.compareAtPrice && product.compareAtPrice > (product.price ?? 0) && (
                            <tr className="border-b">
                                <td className="py-2 font-medium pr-4">Redna cena</td>
                                <td className="py-2 line-through">€{product.compareAtPrice.toFixed(2)}</td>
                            </tr>
                        )} */}
                        <tr className="border-b">
                            <td className="py-2 font-medium pr-4">Proizvajalec</td>
                            <td className="py-2">{product.manufacturer || 'N/A'}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 font-medium pr-4">Tip naprave</td>
                            <td className="py-2">{product.type || 'N/A'}</td>
                        </tr>
                        
                        <tr>
                            <td className="py-2 font-medium pr-4">Vključena osnovna montaža</td>
                            <td className="py-2">{formatBoolean(product.mountingIncluded)}</td>
                        </tr>
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
} 
import React from 'react';
import { ThumbsUp, Truck, Wrench, XCircle, Tag, ShieldCheck } from 'lucide-react';
import { Product } from '@payload-types';


export default function ProductFeatures({ product }: { product: Product }) {
    return (
        <>
            {/* Features/Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
                <div className="flex items-center gap-2">
                    {product.inStock ? 
                        <ThumbsUp className="text-green-600 w-5 h-5 flex-shrink-0" /> : 
                        <XCircle className="text-red-600 w-5 h-5 flex-shrink-0" />
                    }
                    <span>
                        {product.inStock ? 'Na zalogi' : 'Ni na zalogi'} - 
                        {product.inStock ? ' Dobavljivo takoj' : ' Preveri dobavljivost'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Truck className="text-primary w-5 h-5 flex-shrink-0" />
                    <span>Brezplačna dostava</span>
                </div>
                <div className="flex items-center gap-2">
                    <Wrench className="text-primary w-5 h-5 flex-shrink-0" />
                    <span>{product.mountingIncluded ? 'Osnovna montaža vključena' : 'Montaža ni vključena'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Tag className="text-primary w-5 h-5 flex-shrink-0" />
                    <span>Fiksna cena</span>
                </div>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="text-primary w-5 h-5 flex-shrink-0" />
                    <span>9.5% DDV vključen</span>
                </div>
            </div>

            {/* Highlights */}
            {product.highlights && product.highlights.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-semibold mb-2 text-md">Ključne lastnosti:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {product.highlights.map((h, index) => (
                            <li key={index}>{h.highlight}</li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
} 
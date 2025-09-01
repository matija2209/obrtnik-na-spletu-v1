import React, { useState } from 'react';
import RichText from '@/components/payload/RichText';
import { Product, ProductVariant } from '@payload-types';
import ProductVariantSelector from '../ProductVariantSelector';


interface ProductDescriptionProps {
    product: Product;
    parentProduct?: Product; // For getting proper variant option labels
}

export default function ProductDescription({ product, parentProduct }: ProductDescriptionProps) {
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

    const handleVariantChange = (variant: ProductVariant | null) => {
        setSelectedVariant(variant);
    };

    // Helper function to get proper label for variant option
    const getOptionLabel = (optionName: string): string => {
        if (parentProduct?.variantOptionTypes) {
            const optionType = parentProduct.variantOptionTypes.find(type => type.name === optionName);
            return optionType?.label || optionName;
        }
        return optionName;
    };

    return (
        <div className="product-description space-y-6">
            {/* Product Description */}
            <div className="description-content">
                {!product.longDescription ? (
                    <p>Opis ni na voljo.</p>
                ) : typeof product.longDescription === 'object' ? (
                    <RichText data={product.longDescription} />
                ) : (
                    <p>{String(product.longDescription)}</p>
                )}
            </div>


            {/* Product Info - shows base product or selected variant info */}
            <div className="product-info">
                {selectedVariant ? (
                    // Show variant-specific information
                    <div className="variant-info">
                        <h3 className="text-lg font-semibold">Informacije o varianti</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <p><strong>SKU:</strong> {selectedVariant.variantSku}</p>
                                {selectedVariant.variantOptions && selectedVariant.variantOptions.map((option, index) => (
                                    option.name && option.value && (
                                        <p key={index}><strong>{getOptionLabel(option.name)}:</strong> {option.value}</p>
                                    )
                                ))}
                            </div>
                            <div>
                                {selectedVariant.price && (
                                    <p className="text-xl font-bold text-green-600">€{selectedVariant.price}</p>
                                )}
                                <p className={selectedVariant.inStock ? 'text-green-600' : 'text-red-600'}>
                                    {selectedVariant.inStock ? 'Na voljo' : 'Ni na voljo'}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Show base product information
                    <div className="base-product-info">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p><strong>SKU:</strong> {product.sku}</p>
                                {product.manufacturer && <p><strong>Proizvajalec:</strong> {product.manufacturer}</p>}
                                {product.type && <p><strong>Model:</strong> {product.type}</p>}
                            </div>
                            <div>
                                {product.price && (
                                    <p className="text-xl font-bold text-green-600">€{product.price}</p>
                                )}
                                <p className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                                    {product.inStock ? 'Na voljo' : 'Ni na voljo'}
                                </p>
                                {product.mountingIncluded && (
                                    <p className="text-sm text-blue-600">Vključena montaža</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 
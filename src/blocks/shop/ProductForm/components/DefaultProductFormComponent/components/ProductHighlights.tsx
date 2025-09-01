import React from 'react';
import Link from 'next/link';
import { ContainedSection } from '@/components/layout/container-section'; // Adjust path
import SectionHeading from '@/components/layout/section-heading'; // Adjust path
import { Button } from '@/components/ui/button'; // Adjust path
import { Product } from '@payload-types';
import { ColorClasses } from '@/utilities/getColorClasses';
import { ProductGrid } from '@/components/product/product-grid';

// Define props for the component
interface ProductHighlightsProps {
    title: string;
    description: string;
    products: (Product & { slug?: string | null })[]; // Updated to match ProductGrid interface
    buttonText: string;
    buttonHref: string;
    colorClasses: ColorClasses;
}

// Make it a regular functional component, remove async
export function ProductHighlights({ 
    title,
    description,
    products,
    buttonText,
    buttonHref,
    colorClasses
}: ProductHighlightsProps) {
    // Data fetching logic is removed

    if (!products || products.length === 0) {
        // Optionally return null or a placeholder if no featured products
        return null;
    }

    return (
        <ContainedSection verticalPadding="xl" overlayClassName='bg-gray-50'>
            <SectionHeading>
                {/* Use props for title and description */}
                <SectionHeading.Title>{title}</SectionHeading.Title>
                <SectionHeading.Description>{description}</SectionHeading.Description>
            </SectionHeading>

            {/* Use products prop */}
            <ProductGrid colorClasses={colorClasses} products={products} className="mb-8" />

            <div className="text-center">
                {/* Use props for button text and href */}
                <Button size="lg">
                    <Link href={buttonHref}>{buttonText}</Link>
                </Button>
            </div>
        </ContainedSection>
    );
} 
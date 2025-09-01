import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Product } from '@payload-types';

interface ProductCTAProps {
    product: Product;
}

export default function ProductCTA({ product }: ProductCTAProps) {
    return (    
        <div className="mb-8">
            <Link href={`/trgovina/narocilo?productId=${product.id}`} passHref>
                <Button size="lg" className="bg-primary hover:bg-primary/90 w-full">
                    Oddaj povpraševanje
                </Button>
            </Link>
        </div>
    );
} 
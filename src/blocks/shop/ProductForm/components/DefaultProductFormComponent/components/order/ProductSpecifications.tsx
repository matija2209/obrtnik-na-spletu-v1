import React from 'react';
import { Product } from '@payload-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';


export function ProductSpecifications({ product }: { product: Product }) {
  const technicalSpecs = product.technicalSpecs;
  
  const specs = [
    { label: 'Proizvajalec', value: product.manufacturer },
    { label: 'SKU', value: product.sku },
    { label: 'Tip', value: product.type },
  ].filter(spec => spec.value); // Only show specs that have values

  if (specs.length === 0 && (!technicalSpecs || technicalSpecs.length === 0)) {
    return null; // Don't render anything if no specs are available
  }

  return (
    <Card className="w-full">
      <CardContent className="space-y-0">
        {/* Basic product information */}
        {specs.map((spec, index) => (
          <React.Fragment key={spec.label}>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm font-medium text-muted-foreground">
                {spec.label}
              </span>
              <span className="text-sm font-semibold">
                {spec.value}
              </span>
            </div>
            {index < specs.length - 1 && <Separator />}
          </React.Fragment>
        ))}
        
        {/* Technical specifications */}
        {technicalSpecs && technicalSpecs.length > 0 && (
          <>
            {specs.length > 0 && <Separator className="my-4" />}
            {technicalSpecs.map((spec, index) => (
              <React.Fragment key={spec.id || index}>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    {spec.label}
                  </span>
                  <span className="text-sm font-semibold">
                    {spec.value}
                  </span>
                </div>
                {index < technicalSpecs.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
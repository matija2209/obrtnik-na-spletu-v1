import React from 'react'

import RichText from '@/components/payload/RichText'
import { CMSLink } from '@/components/payload/Link'

// Define the interface for the CallToAction block
interface CallToActionBlockProps {
  richText?: any;
  links?: Array<{
    link: any;
  }>;
  id?: string | null;
  blockName?: string | null;
  blockType: 'cta';
}

export const CallToActionBlock: React.FC<CallToActionBlockProps> = ({ links, richText }) => {
  return (
    <div className="container">
      <div className="bg-card rounded border-border border p-4 flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
        <div className="max-w-[48rem] flex items-center">
          {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
        </div>
        <div className="flex flex-col gap-8">
          {(links || []).map(({ link }, i: number) => {
            return <CMSLink key={i} size="lg" {...link} />
          })}
        </div>
      </div>
    </div>
  )
}

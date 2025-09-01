import React from 'react'
import type { CodeBlock as CodeBlockType } from '@payload-types'

import { Code } from './Component.client'

type Props = CodeBlockType & {
  className?: string
}

export const CodeBlock: React.FC<Props> = ({ className, code, language }) => {
  return (
    <div className={[className, 'not-prose'].filter(Boolean).join(' ')}>
      <Code code={code} language={language || undefined} />
    </div>
  )
}

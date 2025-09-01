

import { Button } from '@payloadcms/ui';
import Link from 'next/link'
import { AdminViewServerProps } from 'payload'
import React from 'react'

function PreviewSite(props:AdminViewServerProps) {
  const {user} = props


  const url = "/"

  return (
    
    <Link href={url} target="_blank" rel="noopener noreferrer">
      <Button >
        Ogled spletne strani
      </Button>
    </Link>
  )
}

export default PreviewSite
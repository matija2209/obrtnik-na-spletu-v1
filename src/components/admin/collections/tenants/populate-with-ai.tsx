'use client'

import { populateTenantWithAI, PopulateTenantWithAIProps } from '@/actions/admin/populate-tenant-with-ai'
import { User } from '@payload-types'
import { Button } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import { BeforeDocumentControlsClientProps } from 'payload'
import { useActionState, useState } from 'react'

const initialState: PopulateTenantWithAIProps = {
  message: '',
  status: "success"
}

function PopulateWithAI(props:BeforeDocumentControlsClientProps) {
  const path = usePathname()

  const [state, formAction, pending] = useActionState(populateTenantWithAI, initialState)

  return (
    <form action={formAction}>
      <input type="hidden" name="tenantId" value={path.split("/").pop()} />
      <p>{state.message}</p>
      <Button disabled={pending} type="submit">PopulateWithAI</Button>
    </form>
  )
}

export default PopulateWithAI
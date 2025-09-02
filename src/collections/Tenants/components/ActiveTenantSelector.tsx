'use client'

import React, { useState } from 'react'
import { useConfig, useAuth, Button, toast, useDocumentInfo } from '@payloadcms/ui'

interface Tenant {
  id: string | number
  name: string
  slug: string
}

const ActiveTenantSelector: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { config } = useConfig()
  const { user } = useAuth()
  const { id } = useDocumentInfo()

  // Get current active tenant from cookie
  const getActiveTenantId = () => {
    if (typeof document === 'undefined') return null
    const cookies = document.cookie.split(';')
    const activeTenantCookie = cookies.find(cookie => 
      cookie.trim().startsWith('active-tenant=')
    )
    return activeTenantCookie ? activeTenantCookie.split('=')[1] : null
  }

  const activeTenantId = getActiveTenantId()
  const currentTenantId = String(id)
  const isCurrentTenantActive = activeTenantId === currentTenantId

  // Check if user has access to this tenant
  const hasAccess = user?.tenants?.some(({ tenant }: { tenant: Tenant }) => {
    const tenantId = typeof tenant === 'object' ? tenant.id : tenant
    return String(tenantId) === currentTenantId
  })

  if (!user || !hasAccess) {
    return null // Don't show component if user doesn't have access
  }

  const handleSetActive = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch(`${config.serverURL}/api/tenants/set-active/${currentTenantId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        toast.success(`Active tenant updated successfully`)
        // Refresh the page to update the UI
        window.location.reload()
      } else {
        toast.error('Failed to set active tenant')
      }
    } catch (error) {
      console.error('Error setting active tenant:', error)
      toast.error('Error setting active tenant')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ 
      padding: '12px', 
      backgroundColor: '#f9f9f9', 
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      marginBottom: '16px'
    }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Active Tenant Status</h4>
      
      {isCurrentTenantActive ? (
        <div style={{ color: '#22c55e', fontSize: '12px' }}>
          ● This is your currently ACTIVE tenant
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
            This tenant is not currently active
          </div>
          <Button
            onClick={handleSetActive}
            disabled={isLoading}
            size="small"
            buttonStyle="primary"
          >
            {isLoading ? 'Setting as Active...' : 'Make This Tenant Active'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default ActiveTenantSelector
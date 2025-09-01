'use client'
import type { FormEvent } from 'react'

import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// const baseClass = 'loginPage' // Can remove this if not needed elsewhere

// go to /tenant1/home
// redirects to /tenant1/login?redirect=%2Ftenant1%2Fhome
// login, uses slug to set payload-tenant cookie

type Props = {
  tenantSlug?: string
  tenantDomain?: string
}
export const Login = ({ tenantSlug, tenantDomain }: Props) => {
  const usernameRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!usernameRef?.current?.value || !passwordRef?.current?.value) {
      return
    }
    const actionRes = await fetch('/api/users/external-users/login', {
      body: JSON.stringify({
        password: passwordRef.current.value,
        tenantSlug,
        tenantDomain,
        username: usernameRef.current.value,
      }),
      headers: {
        'content-type': 'application/json',
      },
      method: 'post',
    })
    const json = await actionRes.json()

    if (actionRes.status === 200 && json.user) {
      const redirectTo = searchParams.get('redirect')
      if (redirectTo) {
        router.push(redirectTo)
        return
      } else {
        if (tenantDomain) {
          router.push('/tenant-domains')
        } else {
          router.push(`/${tenantSlug}`)
        }
      }
    } else if (actionRes.status === 400 && json?.errors?.[0]?.message) {
      window.alert(json.errors[0].message)
    } else {
      window.alert('Something went wrong, please try again.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-sm">
        <div className="flex justify-center py-4">
          <Image
            src="/obrtnik-na-spletu-transparent.png"
            alt="Laneks Logo"
            width={100}
            height={100}
            className="h-auto"
          />
        </div>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Prijava</CardTitle>
          <CardDescription className="text-center">
            <p>Prijavljate se v domeno {tenantDomain ? tenantDomain : tenantSlug}</p>
            <p>Vnesite uporabniško ime in geslo za dostop.</p>
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Uporabniško ime</Label>
              <Input
                id="username"
                name="username"
                ref={usernameRef}
                type="text"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Geslo</Label>
              <Input
                id="password"
                name="password"
                ref={passwordRef}
                type="password"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Prijava
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

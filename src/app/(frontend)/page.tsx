import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-background">
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <div className="flex flex-col items-center text-center gap-8">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-md shadow-sm ring-1 ring-border">
              <Image
                src="/obrtnik-na-spletu-transparent.png"
                alt="ObrtnikNaSpletu Logo"
                fill
                sizes="40px"
                className="object-contain"
                priority
              />
            </div>
            <span className="text-lg font-semibold tracking-tight">ObrtnikNaSpletu</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Welcome to ObrtnikNaSpletu</h1>
            <p className="text-muted-foreground max-w-prose">
              Please proceed to the admin dashboard to sign in and continue.
            </p>
          </div>

          <Alert className="mt-2 w-full text-left">
            <AlertTitle>Admin Access</AlertTitle>
            <AlertDescription>
              Use your credentials to log in at the admin portal. If you don&apos;t have an
              account yet, contact your administrator.
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-3 pt-2">
            <Button asChild size="lg">
              <Link href="/admin">Go to /admin</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
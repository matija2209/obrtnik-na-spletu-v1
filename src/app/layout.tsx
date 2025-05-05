import React, { Suspense } from "react";
// import { GoogleAnalytics } from '@next/third-parties/google'
import CookieConsent from "@/components/cookie-consent";
import AnalyticsLoader from "@/components/analytics-loader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        {children}
        <AnalyticsLoader />
        <Suspense fallback={null}>
            <CookieConsent />
          </Suspense>
        </>
  );
}

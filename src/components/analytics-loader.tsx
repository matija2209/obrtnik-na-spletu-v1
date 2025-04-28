'use client'

import { useState, useEffect } from 'react'
import { GoogleAnalytics } from '@next/third-parties/google'

// You can keep the GA ID here or pass it as a prop
const GA_MEASUREMENT_ID = "G-55LCBJRWCW"; 

export default function AnalyticsLoader() {
  const [consentGiven, setConsentGiven] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Ensure this runs only on the client after hydration
    setMounted(true); 
    const consentStatus = localStorage.getItem('cookie-consent');
    if (consentStatus === 'true') {
      setConsentGiven(true);
    }
  }, []);

  // Don't render anything on the server or before mount
  if (!mounted) {
      return null;
  }

  // Render GA only if consent has been given client-side
  return consentGiven ? <GoogleAnalytics gaId={GA_MEASUREMENT_ID} /> : null;
} 
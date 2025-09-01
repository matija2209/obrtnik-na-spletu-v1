'use client';
import { useState, useEffect } from 'react';

/**
 * Custom hook to track scroll state
 * Returns true when user has scrolled more than 10px from top
 */
export const useScrollState = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isScrolled;
};
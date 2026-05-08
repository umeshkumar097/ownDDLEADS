'use client';

import React, { createContext, useContext } from 'react';
import { BrandingConfig } from '@/lib/branding';

const BrandingContext = createContext<BrandingConfig | null>(null);

export function BrandingProvider({ 
  children, 
  branding 
}: { 
  children: React.ReactNode; 
  branding: BrandingConfig 
}) {
  return (
    <BrandingContext.Provider value={branding}>
      <style jsx global>{`
        :root {
          --brand-primary: ${branding.brandColor};
        }
      `}</style>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
}

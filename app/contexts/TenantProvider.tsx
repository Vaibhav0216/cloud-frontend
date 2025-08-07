'use client';

import { createContext, useContext, ReactNode } from 'react';

interface TenantConfig {
  features: {
    deviceControl: boolean;
    advancedAnalytics: boolean;
    customBranding: boolean;
  };
  theme: {
    primaryColor: string;
    logo?: string;
  };
  limits: {
    maxDevices: number;
    maxUsers: number;
  };
}

interface TenantContextType {
  config: TenantConfig;
  hasFeature: (feature: keyof TenantConfig['features']) => boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
}

export function TenantProvider({ children }: TenantProviderProps) {
  // Mock tenant configuration - in real app, this would come from API
  const config: TenantConfig = {
    features: {
      deviceControl: true,
      advancedAnalytics: true,
      customBranding: false,
    },
    theme: {
      primaryColor: '#1e3a8a',
    },
    limits: {
      maxDevices: 100,
      maxUsers: 10,
    },
  };

  const hasFeature = (feature: keyof TenantConfig['features']) => {
    return config.features[feature];
  };

  return (
    <TenantContext.Provider value={{ config, hasFeature }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
} 
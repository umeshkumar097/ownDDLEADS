import { db } from '@/db';
import { agencies } from '@/db/schema';
import { eq, or } from 'drizzle-orm';

export interface BrandingConfig {
  name: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  brandColor: string;
  isWhitelabel: boolean;
}

export const DEFAULT_BRANDING: BrandingConfig = {
  name: 'Aiclex | DhandaLeads',
  logoUrl: '/logo.png',
  faviconUrl: '/favicon.ico',
  brandColor: '#0f172a', // Indigo-950
  isWhitelabel: false,
};

/**
 * Fetches branding configuration based on the hostname.
 * Supports subdomains (agency.dhandaleads.com) and custom domains.
 */
export async function getBrandingByHost(host: string | null): Promise<BrandingConfig> {
  if (!host) return DEFAULT_BRANDING;

  // 1. Clean host (remove port if any)
  const cleanHost = host.split(':')[0].toLowerCase();

  // 2. Ignore local development hosts unless specifically mapped
  if (cleanHost === 'localhost' || cleanHost === '127.0.0.1') {
    return DEFAULT_BRANDING;
  }

  // 3. Extract subdomain if it's a dhandaleads.com subdomain
  // Note: Adjust the base domain as per production
  const baseDomain = 'dhandaleads.com';
  let agency = null;

  try {
    if (cleanHost.endsWith(`.${baseDomain}`)) {
      const subdomain = cleanHost.replace(`.${baseDomain}`, '');
      if (subdomain && subdomain !== 'www') {
        [agency] = await db.select()
          .from(agencies)
          .where(eq(agencies.subdomain, subdomain))
          .limit(1);
      }
    } else {
      // 4. Check for custom domain
      [agency] = await db.select()
        .from(agencies)
        .where(eq(agencies.customDomain, cleanHost))
        .limit(1);
    }

    if (agency) {
      return {
        name: agency.name,
        logoUrl: agency.logoUrl,
        faviconUrl: agency.faviconUrl,
        brandColor: agency.brandColor ?? '#0f172a',
        isWhitelabel: true,
      };
    }
  } catch (error) {
    console.error('Error fetching branding:', error);
  }

  return DEFAULT_BRANDING;
}

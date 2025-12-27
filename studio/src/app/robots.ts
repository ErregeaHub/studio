import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/urls';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/settings/',
        '/verify/',
        '/verify-email/',
        '/login',
        '/signup',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

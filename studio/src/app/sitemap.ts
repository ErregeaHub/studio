import { MetadataRoute } from 'next';
import { MediaRepository, UserRepository } from '@/lib/repositories';
import { getBaseUrl } from '@/lib/urls';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const mediaRepo = new MediaRepository();
  const userRepo = new UserRepository();

  // Get all media and users for dynamic paths
  const allMedia = await mediaRepo.findAll();
  const allUsers = await userRepo.findAll();

  const mediaEntries = allMedia.map((media) => ({
    url: `${baseUrl}/media/${media.id}`,
    lastModified: new Date(media.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const userEntries = allUsers.map((user) => ({
    url: `${baseUrl}/profile/${user.username}`,
    lastModified: new Date(user.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  const staticEntries = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/discover`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ];

  return [...staticEntries, ...mediaEntries, ...userEntries];
}

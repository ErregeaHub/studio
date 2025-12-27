export function getBaseUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL || 'https://errhub.xyz';
  return url.startsWith('http') ? url : `https://${url}`;
}

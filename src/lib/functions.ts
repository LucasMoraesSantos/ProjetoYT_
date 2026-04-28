import { auth } from './firebase';

const baseUrl = import.meta.env.VITE_FUNCTIONS_BASE_URL;

async function authedFetch<T>(path: string, body: unknown): Promise<T> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error('Usuário não autenticado.');

  const response = await fetch(`${baseUrl}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Falha em ${path}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const functionsClient = {
  generateScript: (payload: unknown) => authedFetch('generateScript', payload),
  reviewScript: (payload: unknown) => authedFetch('reviewScript', payload),
  generateMetadata: (payload: unknown) => authedFetch('generateMetadata', payload),
  scanYoutubeTrends: (payload: unknown) => authedFetch('scanYoutubeTrends', payload),
};

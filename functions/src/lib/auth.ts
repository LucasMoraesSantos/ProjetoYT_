import { Request } from 'firebase-functions/v2/https';
import { HttpsError } from 'firebase-functions/v2/https';
import { adminAuth } from './admin';

export async function requireUser(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new HttpsError('unauthenticated', 'Authorization Bearer token é obrigatório.');
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    return await adminAuth.verifyIdToken(token);
  } catch {
    throw new HttpsError('unauthenticated', 'Firebase ID Token inválido.');
  }
}

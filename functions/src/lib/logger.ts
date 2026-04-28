import { adminDb } from './admin';

export async function logAppEvent(input: {
  userId: string;
  level: 'info' | 'warn' | 'error';
  area: string;
  message: string;
  metadata?: Record<string, unknown>;
}) {
  await adminDb.collection('appLogs').add({
    ...input,
    createdAt: new Date().toISOString(),
  });
}

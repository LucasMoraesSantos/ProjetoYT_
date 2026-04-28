import { onRequest } from 'firebase-functions/v2/https';
import { corsConfig } from './lib/cors';
import { requireUser } from './lib/auth';
import { adminDb } from './lib/admin';

export const analyzePerformanceInsights = onRequest({ cors: corsConfig, secrets: ['OPENAI_API_KEY', 'AI_MODEL'] }, async (req, res) => {
  const user = await requireUser(req);
  const { channelId, periodStart, periodEnd } = req.body as { channelId: string; periodStart: string; periodEnd: string };

  await adminDb.collection('performanceInsights').add({
    userId: user.uid,
    channelId,
    periodStart,
    periodEnd,
    insightType: 'placeholder',
    title: 'Insights serão gerados em versão futura',
    description: 'Base preparada para integração de analytics YouTube OAuth.',
    confidenceScore: 0,
    metadata: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  res.json({ ok: true });
});

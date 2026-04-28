import { onRequest } from 'firebase-functions/v2/https';
import { corsConfig } from './lib/cors';
import { requireUser } from './lib/auth';
import { adminDb } from './lib/admin';
import { getAiModel, getOpenAIClient } from './lib/openai';
import { logAppEvent } from './lib/logger';

export const reviewScript = onRequest({ cors: corsConfig, secrets: ['OPENAI_API_KEY', 'AI_MODEL'] }, async (req, res) => {
  const user = await requireUser(req);
  const { scriptId } = req.body as { scriptId: string };

  const scriptRef = adminDb.collection('scripts').doc(scriptId);
  const scriptSnap = await scriptRef.get();
  if (!scriptSnap.exists || scriptSnap.data()?.userId !== user.uid) {
    res.status(404).json({ error: 'Roteiro não encontrado.' });
    return;
  }

  const prompt = `Revise o roteiro abaixo e retorne JSON válido com qualityScore (0-100) e qualityNotes. Avalie clareza, retenção, originalidade, naturalidade do idioma, força do hook, potencial de CTR e riscos. Roteiro: ${JSON.stringify(scriptSnap.data())}`;

  const completion = await getOpenAIClient().responses.create({ model: getAiModel(), input: prompt });
  let parsed: { qualityScore: number; qualityNotes: string };
  try {
    parsed = JSON.parse(completion.output_text) as { qualityScore: number; qualityNotes: string };
  } catch {
    res.status(500).json({ error: 'A IA não retornou revisão em JSON válido.' });
    return;
  }

  await scriptRef.update({
    qualityScore: Math.max(0, Math.min(100, parsed.qualityScore)),
    qualityNotes: parsed.qualityNotes,
    updatedAt: new Date().toISOString(),
  });

  await logAppEvent({ userId: user.uid, level: 'info', area: 'reviewScript', message: 'Roteiro revisado', metadata: { scriptId } });
  res.json(parsed);
});

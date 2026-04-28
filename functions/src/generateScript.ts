import { onRequest } from 'firebase-functions/v2/https';
import { corsConfig } from './lib/cors';
import { requireUser } from './lib/auth';
import { adminDb } from './lib/admin';
import { getAiModel, getOpenAIClient } from './lib/openai';
import { logAppEvent } from './lib/logger';

export const generateScript = onRequest({ cors: corsConfig, secrets: ['OPENAI_API_KEY', 'AI_MODEL'] }, async (req, res) => {
  const user = await requireUser(req);
  const { channelId, opportunityId, topic, targetDurationMinutes = 8, language = 'pt-BR' } = req.body as {
    channelId: string;
    opportunityId?: string;
    topic: string;
    targetDurationMinutes?: number;
    language?: string;
  };

  const channelSnap = await adminDb.collection('channels').doc(channelId).get();
  if (!channelSnap.exists || channelSnap.data()?.userId !== user.uid) {
    res.status(404).json({ error: 'Canal não encontrado.' });
    return;
  }

  const editorialProfileQuery = await adminDb
    .collection('editorialProfiles')
    .where('userId', '==', user.uid)
    .where('channelId', '==', channelId)
    .limit(1)
    .get();
  const profile = editorialProfileQuery.docs[0]?.data() ?? {};

  const prompt = `Você é um editor de YouTube dark. Retorne JSON válido com campos: title, hook, fullScript, sceneBreakdown, visualSuggestions, thumbnailIdeas, youtubeTitleOptions, youtubeDescription, youtubeTags, chapters. Idioma: ${language}. Tema: ${topic}. Duração alvo: ${targetDurationMinutes}. Perfil: ${JSON.stringify(profile)}.`;

  const client = getOpenAIClient();
  const completion = await client.responses.create({
    model: getAiModel(),
    input: prompt,
  });

  const text = completion.output_text;
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(text);
  } catch {
    res.status(500).json({ error: 'A IA não retornou JSON válido.' });
    return;
  }

  const docRef = await adminDb.collection('scripts').add({
    ...parsed,
    userId: user.uid,
    channelId,
    opportunityId: opportunityId ?? null,
    topic,
    language,
    targetDurationMinutes,
    status: 'script_ready',
    qualityScore: null,
    qualityNotes: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await logAppEvent({ userId: user.uid, level: 'info', area: 'generateScript', message: 'Roteiro gerado', metadata: { scriptId: docRef.id, channelId } });
  res.json({ scriptId: docRef.id, script: parsed });
});

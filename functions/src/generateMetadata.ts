import { onRequest } from 'firebase-functions/v2/https';
import { corsConfig } from './lib/cors';
import { requireUser } from './lib/auth';
import { adminDb } from './lib/admin';
import { getAiModel, getOpenAIClient } from './lib/openai';
import { logAppEvent } from './lib/logger';

export const generateMetadata = onRequest({ cors: corsConfig, secrets: ['OPENAI_API_KEY', 'AI_MODEL'] }, async (req, res) => {
  const user = await requireUser(req);
  const { scriptId } = req.body as { scriptId: string };

  const scriptRef = adminDb.collection('scripts').doc(scriptId);
  const snap = await scriptRef.get();
  if (!snap.exists || snap.data()?.userId !== user.uid) {
    res.status(404).json({ error: 'Roteiro não encontrado.' });
    return;
  }

  const prompt = `Com base no roteiro abaixo, retorne JSON válido com os campos youtubeTitleOptions (array), youtubeDescription (string), youtubeTags (array), chapters (array), thumbnailIdeas (array). Roteiro: ${JSON.stringify(
    snap.data(),
  )}`;

  const response = await getOpenAIClient().responses.create({ model: getAiModel(), input: prompt });
  let parsed: {
    youtubeTitleOptions: string[];
    youtubeDescription: string;
    youtubeTags: string[];
    chapters: string[];
    thumbnailIdeas: string[];
  };

  try {
    parsed = JSON.parse(response.output_text) as typeof parsed;
  } catch {
    res.status(500).json({ error: 'A IA não retornou metadata em JSON válido.' });
    return;
  }

  await scriptRef.update({
    youtubeTitleOptions: parsed.youtubeTitleOptions ?? [],
    youtubeDescription: parsed.youtubeDescription ?? '',
    youtubeTags: parsed.youtubeTags ?? [],
    chapters: parsed.chapters ?? [],
    thumbnailIdeas: parsed.thumbnailIdeas ?? [],
    updatedAt: new Date().toISOString(),
  });

  await logAppEvent({ userId: user.uid, level: 'info', area: 'generateMetadata', message: 'Metadata gerada', metadata: { scriptId } });
  res.json(parsed);
});

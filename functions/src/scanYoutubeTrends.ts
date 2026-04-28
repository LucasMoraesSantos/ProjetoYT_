import { onRequest } from 'firebase-functions/v2/https';
import { corsConfig } from './lib/cors';
import { requireUser } from './lib/auth';
import { searchYoutubeVideos } from './lib/youtube';
import { adminDb } from './lib/admin';
import { logAppEvent } from './lib/logger';

function daysSince(date: string): number {
  return Math.max(1, (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
}

export const scanYoutubeTrends = onRequest({ cors: corsConfig, secrets: ['YOUTUBE_API_KEY'] }, async (req, res) => {
  const user = await requireUser(req);
  const {
    channelId = null,
    niche,
    language,
    country,
    keywords = [],
    maxResults = 10,
  } = req.body as {
    channelId?: string | null;
    niche: string;
    language: string;
    country: string;
    keywords: string[];
    maxResults: number;
  };

  const videos = await searchYoutubeVideos({ keywords, language, country, maxResults });
  const opportunities: Array<Record<string, unknown>> = [];

  for (const video of videos) {
    const viewVelocity = video.viewCount / daysSince(video.publishedAt);
    const engagementRate = video.viewCount > 0 ? (video.likeCount + video.commentCount) / video.viewCount : 0;
    const competitionScore = Math.max(0, 100 - Math.min(100, viewVelocity / 100));
    const evergreenScore = 60;
    const monetizationSafety = 80;
    const productionEase = 70;
    const opportunityScore =
      viewVelocity * 0.3 +
      engagementRate * 100 * 0.2 +
      competitionScore * 0.2 +
      evergreenScore * 0.15 +
      monetizationSafety * 0.1 +
      productionEase * 0.05;

    const competitorRef = await adminDb.collection('competitorVideos').add({
      userId: user.uid,
      youtubeVideoId: video.youtubeVideoId,
      channelTitle: video.channelTitle,
      channelId: channelId ?? null,
      title: video.title,
      description: video.description,
      publishedAt: video.publishedAt,
      viewCount: video.viewCount,
      likeCount: video.likeCount,
      commentCount: video.commentCount,
      durationSeconds: null,
      language,
      country,
      niche,
      topic: video.title,
      thumbnailUrl: video.thumbnailUrl,
      videoUrl: `https://www.youtube.com/watch?v=${video.youtubeVideoId}`,
      collectedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const opportunity = {
      userId: user.uid,
      channelId,
      niche,
      language,
      country,
      keyword: keywords[0] ?? '',
      topic: video.title,
      source: 'youtube_data_api',
      opportunityScore,
      viewVelocity,
      engagementRate,
      competitionScore,
      evergreenScore,
      monetizationSafety,
      productionEase,
      notes: 'Gerado automaticamente pelo scanner.',
      status: 'suggested',
      relatedVideoIds: [competitorRef.id],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const doc = await adminDb.collection('trendOpportunities').add(opportunity);
    opportunities.push({ id: doc.id, ...opportunity });
  }

  opportunities.sort((a, b) => Number(b.opportunityScore) - Number(a.opportunityScore));

  await logAppEvent({ userId: user.uid, level: 'info', area: 'scanYoutubeTrends', message: 'Scan concluído', metadata: { total: opportunities.length } });
  res.json({ opportunities });
});

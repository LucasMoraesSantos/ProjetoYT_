export interface YoutubeVideo {
  youtubeVideoId: string;
  channelTitle: string;
  title: string;
  description: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  thumbnailUrl: string;
}

export async function searchYoutubeVideos(input: {
  keywords: string[];
  language: string;
  country: string;
  maxResults: number;
}): Promise<YoutubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error('YOUTUBE_API_KEY não configurada.');

  const q = encodeURIComponent(input.keywords.join(' | '));
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${input.maxResults}&q=${q}&regionCode=${input.country}&relevanceLanguage=${input.language}&key=${apiKey}`;
  const searchRes = await fetch(searchUrl);
  const searchData = (await searchRes.json()) as {
    items: Array<{ id: { videoId: string }; snippet: { channelTitle: string; title: string; description: string; publishedAt: string; thumbnails: { high?: { url: string }; default?: { url: string } } } }>;
  };

  const ids = searchData.items.map((item) => item.id.videoId).join(',');
  if (!ids) return [];

  const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids}&key=${apiKey}`;
  const detailsRes = await fetch(detailsUrl);
  const detailsData = (await detailsRes.json()) as {
    items: Array<{ id: string; statistics: { viewCount?: string; likeCount?: string; commentCount?: string } }>;
  };

  const statMap = new Map(detailsData.items.map((item) => [item.id, item.statistics]));
  return searchData.items.map((item) => {
    const stats = statMap.get(item.id.videoId);
    return {
      youtubeVideoId: item.id.videoId,
      channelTitle: item.snippet.channelTitle,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      viewCount: Number(stats?.viewCount ?? 0),
      likeCount: Number(stats?.likeCount ?? 0),
      commentCount: Number(stats?.commentCount ?? 0),
      thumbnailUrl: item.snippet.thumbnails.high?.url ?? item.snippet.thumbnails.default?.url ?? '',
    };
  });
}

export type ProductionStatus =
  | 'idea_discovered'
  | 'idea_approved'
  | 'script_generating'
  | 'script_ready'
  | 'video_in_production'
  | 'video_ready'
  | 'youtube_uploading'
  | 'youtube_scheduled'
  | 'published'
  | 'failed';

export interface Channel {
  id: string;
  userId: string;
  name: string;
  youtubeChannelId?: string;
  youtubeChannelTitle?: string;
  language: string;
  countryTarget: string;
  niche: string;
  createdAt: string;
  updatedAt: string;
}

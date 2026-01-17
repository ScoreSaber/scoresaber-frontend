export interface RankedBatchConfig {
   videoId: string;
   month: string;
   year: number;
   announcementId: string;
}

export const rankedBatch: RankedBatchConfig = {
   videoId: 'lMPpoh8DGU8',
   month: 'January',
   year: 2025,
   announcementId: 'january-2025-ranked-batch'
};

export function getYouTubeUrl(videoId: string): string {
   return `https://youtu.be/${videoId}`;
}

export function getYouTubeEmbedUrl(videoId: string): string {
   return `https://www.youtube.com/embed/${videoId}`;
}

export function getBatchTitle(month: string): string {
   return `${month} Ranked Batch Overview`;
}

export function getAnnouncementMessage(month: string): string {
   return `The ${month} ScoreSaber Ranked Batch Overview video is out!`;
}

export function getReweightsUrl(month: string, year: number): string {
   const monthFormatted = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
   return `https://wiki.scoresaber.com/ranking/reweights/${year}/${monthFormatted}-${year}.html`;
}

export function getReweightsLinkText(month: string, year: number): string {
   return `View ${month} ${year} Reweights`;
}

import { ExternalLink, Play } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { HomeRankedBatchVideo } from './actions/news';
import { HOME_BANNER_SRC, HOME_NEWS_YOUTUBE_HANDLE } from './home-constants';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function RankedBatchSection({ video }: { video: HomeRankedBatchVideo | null }) {
   const t = useTranslations('home');
   const watchHref = video?.href ?? `https://youtube.com/${HOME_NEWS_YOUTUBE_HANDLE}`;

   return (
      <Card variant="settings" className="gap-0 overflow-hidden border-white/20 py-0 md:flex-row">
         <a
            href={watchHref}
            target="_blank"
            rel="noreferrer"
            aria-label={t('rankedBatch.watchAction')}
            className="relative aspect-video shrink-0 overflow-hidden md:aspect-auto md:min-h-44 md:w-[22rem] lg:w-[24rem]"
         >
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${video?.imageUrl ?? HOME_BANNER_SRC}')` }} />
            <div className="bg-background/55 absolute inset-0" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="bg-primary text-primary-foreground shadow-primary/30 flex size-14 items-center justify-center rounded-full shadow-lg">
                  <Play className="ml-0.5 size-6 fill-current" aria-hidden />
               </div>
            </div>
         </a>

         <div className="flex flex-1 flex-col justify-center gap-3 p-5 sm:p-7">
            <div className="text-muted-foreground text-xs font-semibold tracking-[0.14em] uppercase">{t('rankedBatch.eyebrow')}</div>
            <div className="flex flex-col gap-2">
               <h2 className="text-xl font-bold">{video?.title ?? t('rankedBatch.title')}</h2>
               <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">{t('rankedBatch.description')}</p>
            </div>
            {video?.reweightsHref && (
               <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap">
                  <Button asChild size="sm" className="cursor-pointer">
                     <a href={video.reweightsHref} target="_blank" rel="noreferrer">
                        {t('rankedBatch.reweightsAction')}
                        <ExternalLink data-icon />
                     </a>
                  </Button>
               </div>
            )}
         </div>
      </Card>
   );
}

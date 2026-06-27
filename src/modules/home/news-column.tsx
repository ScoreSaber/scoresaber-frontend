import { type ComponentType, useEffect, useRef, useState } from 'react';

import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { HomeNewsPost, HomeNewsSource } from './actions/news';
import { HomeColumnEmptyCard } from './home-column';

import { Card } from '@/components/ui/card';

import { Icons } from '@/shared/components/icons';
import { Time } from '@/shared/components/time';
import { cn } from '@/shared/format/helpers';
import { socialLinks } from '@/shell/nav-data';

const NEWS_SOCIAL_LABELS = new Set(['Patreon', 'X', 'YouTube']);

const SOURCE_ICONS: Record<HomeNewsSource, ComponentType<{ className?: string; 'aria-hidden'?: boolean }>> = {
   patreon: Icons.patreon,
   x: Icons.twitter,
   youtube: Icons.youtube
};

export function NewsColumn({ posts }: { posts: HomeNewsPost[] }) {
   const t = useTranslations('home');
   const { scrollRef, showTopScrollFade, showBottomScrollFade } = useNewsScrollFade(posts.length);

   if (posts.length === 0) {
      return <HomeColumnEmptyCard>{t('empty.news')}</HomeColumnEmptyCard>;
   }

   return (
      <div className="relative min-h-0 flex-1">
         <div
            ref={scrollRef}
            className={cn(
               'grid max-h-[19.25rem] auto-rows-min gap-2.5 overflow-y-auto pr-1',
               showTopScrollFade && showBottomScrollFade && 'home-news-scroll-fade-both',
               showTopScrollFade && !showBottomScrollFade && 'home-news-scroll-fade-top',
               !showTopScrollFade && showBottomScrollFade && 'home-news-scroll-fade-bottom'
            )}
         >
            {posts.map((post) => (
               <NewsCard key={post.id} post={post} />
            ))}
         </div>
      </div>
   );
}

function useNewsScrollFade(itemCount: number) {
   const scrollRef = useRef<HTMLDivElement>(null);
   const [showTopScrollFade, setShowTopScrollFade] = useState(false);
   const [showBottomScrollFade, setShowBottomScrollFade] = useState(false);

   useEffect(() => {
      const scrollElement = scrollRef.current;
      if (!scrollElement) return;

      const updateScrollFade = () => {
         setShowTopScrollFade(scrollElement.scrollTop > 1);
         setShowBottomScrollFade(scrollElement.scrollTop + scrollElement.clientHeight < scrollElement.scrollHeight - 1);
      };

      updateScrollFade();
      scrollElement.addEventListener('scroll', updateScrollFade, { passive: true });
      window.addEventListener('resize', updateScrollFade);

      return () => {
         scrollElement.removeEventListener('scroll', updateScrollFade);
         window.removeEventListener('resize', updateScrollFade);
      };
   }, [itemCount]);

   return { scrollRef, showTopScrollFade, showBottomScrollFade };
}

function NewsCard({ post }: { post: HomeNewsPost }) {
   const t = useTranslations('home');
   const tc = useTranslations('common');
   const Icon = SOURCE_ICONS[post.source];
   const { bodyRef, expanded, clamped, expand } = useBodyClamp(post.body);
   // image only posts show their images up front, others reveal them on expansion
   const images = post.imageUrls ?? [];
   const imagesAlwaysVisible = images.length > 0 && !post.body;
   const showImages = images.length > 0 && (expanded || imagesAlwaysVisible);
   // youtube descriptions aren't worth expanding, the post links to the video anyway
   const showReadMore = post.source !== 'youtube' && !expanded && (clamped || (images.length > 0 && !imagesAlwaysVisible));

   return (
      <Card variant="settings" className="min-h-0 gap-2 border-white/20 p-4">
         <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <Icon className="size-3.5 shrink-0 fill-current" aria-hidden />
            <a
               href={post.sourceHref ?? post.href}
               target="_blank"
               rel="noreferrer"
               className="text-foreground hover:text-primary font-semibold transition-colors"
            >
               {post.sourceLabel}
            </a>
            <Time date={post.publishedAt} short />
            <a
               href={post.href}
               target="_blank"
               rel="noreferrer"
               aria-label={tc('openInNewTab')}
               className="hover:text-primary ml-auto shrink-0 transition-colors"
            >
               <ExternalLink className="size-3.5" aria-hidden />
            </a>
         </div>
         {post.title && (
            <h3 className="line-clamp-1 text-sm font-bold">
               <a href={post.href} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                  {post.title}
               </a>
            </h3>
         )}
         {post.body && (
            <p
               ref={bodyRef}
               className={cn(
                  'text-muted-foreground text-sm leading-relaxed',
                  !expanded && (post.source === 'youtube' ? 'line-clamp-2' : 'line-clamp-3')
               )}
            >
               {renderPostBody(post)}
            </p>
         )}
         {showImages && images.map((src) => <img key={src} src={src} alt="" loading="lazy" className="max-h-64 max-w-full self-start rounded-md" />)}
         {showReadMore && (
            <button type="button" onClick={expand} className="text-primary self-start text-xs font-medium hover:underline">
               {t('news.readMore')}
            </button>
         )}
      </Card>
   );
}

// linkify urls and @mentions in tweet bodies
function renderPostBody(post: HomeNewsPost) {
   if (post.source !== 'x') return post.body;

   return post.body.split(/(https?:\/\/\S+|\B@\w{1,15})/g).map((part, index) => {
      if (/^https?:\/\//.test(part)) {
         return (
            <a key={index} href={part} target="_blank" rel="noreferrer" className="text-primary break-words hover:underline">
               {displayUrl(part)}
            </a>
         );
      }
      if (/^@\w/.test(part)) {
         return (
            <a key={index} href={`https://x.com/${part.slice(1)}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">
               {part}
            </a>
         );
      }
      return part;
   });
}

// trim the protocol so links don't dominate the card
function displayUrl(value: string) {
   const display = value.replace(/^https?:\/\/(www\.)?/, '');
   return display.length > 40 ? `${display.slice(0, 39)}...` : display;
}

// detects whether the clamped body overflows so the card can offer expansion
function useBodyClamp(body: string) {
   const bodyRef = useRef<HTMLParagraphElement>(null);
   const [expanded, setExpanded] = useState(false);
   const [clamped, setClamped] = useState(false);

   useEffect(() => {
      const element = bodyRef.current;
      if (element) setClamped(element.scrollHeight > element.clientHeight + 1);
   }, [body]);

   return { bodyRef, expanded, clamped, expand: () => setExpanded(true) };
}

export function NewsSocialLinks() {
   return (
      <div className="flex items-center gap-0.5">
         {socialLinks
            .filter(({ label }) => NEWS_SOCIAL_LABELS.has(label))
            .map(({ href, label, Icon }) => (
               <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="text-muted-foreground hover:text-primary rounded-md p-1.5 transition-colors"
               >
                  <Icon className="size-3.5 fill-current" aria-hidden="true" />
               </a>
            ))}
      </div>
   );
}

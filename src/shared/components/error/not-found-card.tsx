'use client';

import type { NotFoundRouteProps } from '@tanstack/react-router';
import { AlertCircle } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { ErrorCard } from '@/shared/components/error/error-card';

interface NotFoundCardProps {
   titleKey?: 'pageNotFound' | 'mapNotFound' | 'playerNotFound';
   descriptionKey?: 'pageNotFoundDesc' | 'mapNotFoundDesc' | 'playerNotFoundDesc';
}

export function NotFoundCard({ titleKey = 'pageNotFound', descriptionKey = 'pageNotFoundDesc' }: NotFoundCardProps) {
   const t = useTranslations('error');

   const title = titleKey === 'mapNotFound' ? t('mapNotFound') : titleKey === 'playerNotFound' ? t('playerNotFound') : t('pageNotFound');
   const description =
      descriptionKey === 'mapNotFoundDesc'
         ? t('mapNotFoundDesc')
         : descriptionKey === 'playerNotFoundDesc'
           ? t('playerNotFoundDesc')
           : t('pageNotFoundDesc');

   return <ErrorCard icon={AlertCircle} title={title} description={description} />;
}

export function RouteNotFound(_props: NotFoundRouteProps) {
   return <NotFoundCard />;
}

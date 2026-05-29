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

   return <ErrorCard icon={AlertCircle} title={t(titleKey)} description={t(descriptionKey)} />;
}

export function RouteNotFound(_props: NotFoundRouteProps) {
   return <NotFoundCard />;
}

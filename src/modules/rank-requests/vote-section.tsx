'use client';

import { Loader2 } from 'lucide-react';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { FaCircleMinus } from 'react-icons/fa6';
import { useTranslations } from 'use-intl';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { qatVote } from '@/modules/rank-requests/actions/qat';
import { rtVote } from '@/modules/rank-requests/actions/rt';
import { cn } from '@/shared/format/helpers';

type VoteValue = 'UPVOTE' | 'DOWNVOTE' | 'NEUTRAL';
type VoteItem = { value: VoteValue; icon: typeof FaThumbsUp; count: number; activeClass: string; hoverClass: string; label: string };

interface VoteSectionProps {
   label: string;
   votes: { upvotes: number; downvotes: number; neutrals?: number; myVote?: VoteValue | null };
   difficultyId?: number;
   group?: 'RT' | 'QAT';
   canVote?: boolean;
}

export function VoteSection({ label, votes, difficultyId, group, canVote }: VoteSectionProps) {
   const t = useTranslations();
   const action = useActionMutation();

   function handleVote(vote: VoteValue) {
      if (!canVote || difficultyId == null || !group) return;
      if (group === 'RT' && vote === 'NEUTRAL') return;

      const isRemovingVote = votes.myVote === vote;
      const voteLabel =
         vote === 'UPVOTE' ? t('rankRequest.upvoteLower') : vote === 'DOWNVOTE' ? t('rankRequest.downvoteLower') : t('rankRequest.neutralLower');
      const successLabel = isRemovingVote
         ? t('rankRequest.voteRemovedDetail', { vote: voteLabel })
         : t('rankRequest.voteRecordedDetail', { vote: voteLabel });
      const runVote = group === 'RT' ? () => rtVote(difficultyId, vote === 'DOWNVOTE' ? 'DOWNVOTE' : 'UPVOTE') : () => qatVote(difficultyId, vote);

      action.runKeyed(vote, runVote, successLabel, t('rankRequest.failedToVote'));
   }

   const pendingVote = action.pendingKey;

   const items: VoteItem[] = [
      voteItem('UPVOTE', FaThumbsUp, votes.upvotes, 'text-green-400', 'hover:text-green-400', t('rankRequest.upvote')),
      // only QAT can neutral vote
      ...(group !== 'RT'
         ? [voteItem('NEUTRAL', FaCircleMinus, votes.neutrals ?? 0, 'text-yellow-400', 'hover:text-yellow-400', t('rankRequest.neutral'))]
         : []),
      voteItem('DOWNVOTE', FaThumbsDown, votes.downvotes, 'text-red-400', 'hover:text-red-400', t('rankRequest.downvote'))
   ];

   return (
      <div className="flex items-center gap-3 text-sm">
         <span className="text-muted-foreground text-xs font-semibold uppercase">{label}</span>
         <div className="flex items-center gap-2.5">
            {items.map(({ value, icon: Icon, count, activeClass, hoverClass, label }) => {
               // hide neutral count when zero and user can't vote
               if (value === 'NEUTRAL' && count === 0 && !canVote) return null;

               const isActive = votes.myVote === value;
               const showSpinner = pendingVote === value;

               const content = (
                  <span
                     className={cn(
                        'flex items-center gap-1 transition-colors',
                        isActive ? activeClass : 'text-muted-foreground',
                        canVote && 'cursor-pointer',
                        canVote && pendingVote == null && hoverClass,
                        pendingVote != null && 'pointer-events-none opacity-60'
                     )}
                     onClick={() => handleVote(value)}
                     role={canVote ? 'button' : undefined}
                     aria-label={canVote ? label : undefined}
                  >
                     {showSpinner ? <Loader2 className="size-3 animate-spin" /> : <Icon className="size-3" />}
                     {count}
                  </span>
               );

               return <span key={value}>{content}</span>;
            })}
         </div>
      </div>
   );
}

function voteItem(value: VoteValue, icon: typeof FaThumbsUp, count: number, activeClass: string, hoverClass: string, label: string): VoteItem {
   return { value, icon, count, activeClass, hoverClass, label };
}

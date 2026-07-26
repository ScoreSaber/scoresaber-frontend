'use client';

import { getRouteApi } from '@tanstack/react-router';
import { useTranslations } from 'use-intl';

import type { RankRequest } from './map-leaderboard-view-types';

import { Separator } from '@/components/ui/separator';

import { getRankRequestDifficulty, isActiveRankRequest } from '@/modules/rank-requests/lib/model';
import { RankRequestComment } from '@/modules/rank-requests/rank-request-comment';
import { RankRequestCommentForm } from '@/modules/rank-requests/rank-request-comment-form';
import { VoteSection } from '@/modules/rank-requests/vote-section';
import { decodeHtmlEntities } from '@/shared/format/helpers';
import Permissions from '@/shared/permissions';

const rankRequestRoute = getRouteApi('/ranking/request/$requestId');

interface MapRankRequestDetailsProps {
   leaderboardId: number;
   rankRequest: RankRequest;
   userPermissions: number;
}

type CommentGroup = 'RT' | 'QAT';

export function MapRankRequestDetails({ leaderboardId, rankRequest, userPermissions }: MapRankRequestDetailsProps) {
   const t = useTranslations();
   const activeDifficulty = getRankRequestDifficulty(rankRequest, leaderboardId);
   const canModifyRequest = isActiveRankRequest(rankRequest);

   const canRtVote = canModifyRequest && Permissions.checkPermissionNumber(userPermissions, Permissions.security.RT | Permissions.security.RTR);
   const canQatVote = canModifyRequest && Permissions.checkPermissionNumber(userPermissions, Permissions.security.QAT);
   const canRtComment = canModifyRequest && Permissions.checkPermissionNumber(userPermissions, Permissions.security.RT | Permissions.security.RTR);
   const canQatComment = canModifyRequest && Permissions.checkPermissionNumber(userPermissions, Permissions.security.QAT);

   const hasDescription = !!rankRequest.description;
   const hasDiffNotes = !!activeDifficulty?.description && activeDifficulty.description !== rankRequest.description;
   const hasCommentForm = canRtComment || canQatComment;
   const commentGroups: CommentGroup[] = [];
   if (canRtComment) commentGroups.push('RT');
   if (canQatComment) commentGroups.push('QAT');
   const hasReplacementTrail = !!rankRequest.replacedBy || !!rankRequest.replacedFrom;
   const hasPreVoteContent = hasReplacementTrail || hasDescription || hasDiffNotes;

   const allComments = activeDifficulty
      ? [
           ...activeDifficulty.rtComments.map((comment) => withCommentGroup(comment, 'RT')),
           ...activeDifficulty.qatComments.map((comment) => withCommentGroup(comment, 'QAT'))
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      : [];
   const hasNoCommentsOrNotesMessage = allComments.length === 0 && !hasCommentForm && !hasDescription && !hasDiffNotes;
   const hasPostVoteContent = hasCommentForm || allComments.length > 0 || hasNoCommentsOrNotesMessage;

   if (!activeDifficulty) {
      return <p className="text-muted-foreground py-6 text-center text-sm">{t('rankRequest.noRankRequestData')}</p>;
   }

   return (
      <div>
         {hasPreVoteContent && (
            <div className="divide-border divide-y">
               {/* replacement trail */}
               {hasReplacementTrail && (
                  <div className="py-3">
                     {rankRequest.replacedBy && (
                        <ReplacementLinkNotice
                           label={t('rankRequest.requestWasReplaced')}
                           requestId={rankRequest.replacedBy.id}
                           mapName={rankRequest.replacedBy.map.songName}
                        />
                     )}
                     {rankRequest.replacedFrom && (
                        <ReplacementLinkNotice
                           label={t('rankRequest.requestReplacedFrom')}
                           requestId={rankRequest.replacedFrom.id}
                           mapName={rankRequest.replacedFrom.map.songName}
                        />
                     )}
                  </div>
               )}

               {/* description */}
               {rankRequest.description && (
                  <div className="py-3">
                     <h3 className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase">
                        {t('rankRequest.rankRequestDescription')}
                     </h3>
                     <p className="text-foreground text-sm whitespace-pre-wrap">{decodeHtmlEntities(rankRequest.description)}</p>
                  </div>
               )}

               {/* difficulty notes */}
               {hasDiffNotes && (
                  <div className="py-3">
                     <h3 className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase">
                        {t('rankRequest.difficultyNotes')}
                     </h3>
                     <p className="text-foreground text-sm whitespace-pre-wrap">{activeDifficulty.description}</p>
                  </div>
               )}
            </div>
         )}

         {/* votes */}
         <div className="flex items-center gap-4 pt-1 pb-3">
            <VoteSection
               label={t('rankRequest.rt')}
               votes={activeDifficulty.rtVotes}
               difficultyId={activeDifficulty.id}
               group="RT"
               canVote={canRtVote}
            />
            <Separator orientation="vertical" variant="gradient" size="toolbar" className="h-4" />
            <VoteSection
               label={t('rankRequest.qat')}
               votes={activeDifficulty.qatVotes}
               difficultyId={activeDifficulty.id}
               group="QAT"
               canVote={canQatVote}
            />
         </div>

         {hasPostVoteContent && (
            <div className="divide-border divide-y border-t">
               {/* comment form */}
               {hasCommentForm && (
                  <div className="py-3">
                     <RankRequestCommentForm difficultyId={activeDifficulty.id} groups={commentGroups} />
                  </div>
               )}

               {/* comments */}
               {allComments.map((comment) => (
                  <div key={`${comment.group}-${comment.id}`} className="py-3">
                     <RankRequestComment
                        comment={comment}
                        obfuscated={rankRequest.commentsObfuscated}
                        group={comment.group}
                        difficultyId={activeDifficulty.id}
                     />
                  </div>
               ))}

               {hasNoCommentsOrNotesMessage && <p className="text-muted-foreground py-6 text-center text-sm">{t('rankRequest.noCommentsOrNotes')}</p>}
            </div>
         )}
      </div>
   );
}

function withCommentGroup<T extends object, TGroup extends CommentGroup>(comment: T, group: TGroup): T & { group: TGroup } {
   return { ...comment, group };
}

function ReplacementLinkNotice({ label, requestId, mapName }: { label: string; requestId: number; mapName: string }) {
   return (
      <div className="bg-muted/40 text-muted-foreground rounded-md border px-3 py-2 text-sm">
         {label}{' '}
         <rankRequestRoute.Link className="text-link font-medium hover:underline" params={{ requestId: requestId.toString() }}>
            {mapName}
         </rankRequestRoute.Link>
      </div>
   );
}

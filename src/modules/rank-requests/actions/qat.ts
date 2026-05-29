import { createServerFn } from '@tanstack/react-start';

import { api } from '@/shared/api/server-api';
import { actionResultVoid } from '@/shared/result/action';

const qatVoteFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { difficultyId: number; vote: 'UPVOTE' | 'DOWNVOTE' | 'NEUTRAL' }) => data)
   .handler(({ data }) => actionResultVoid(api.ranking.rankingControllerQatVote({ id: data.difficultyId }, { vote: data.vote })));

const qatCommentFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { difficultyId: number; comment: string }) => data)
   .handler(({ data }) => actionResultVoid(api.ranking.rankingControllerQatComment({ id: data.difficultyId }, { comment: data.comment })));

const qatDeleteCommentFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { difficultyId: number; commentId: number }) => data)
   .handler(({ data }) => actionResultVoid(api.ranking.rankingControllerQatDeleteComment({ id: data.difficultyId, commentId: data.commentId })));

const qatEditCommentFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { difficultyId: number; commentId: number; comment: string }) => data)
   .handler(({ data }) =>
      actionResultVoid(api.ranking.rankingControllerQatEditComment({ id: data.difficultyId, commentId: data.commentId }, { comment: data.comment }))
   );

export async function qatVote(difficultyId: number, vote: 'UPVOTE' | 'DOWNVOTE' | 'NEUTRAL') {
   return qatVoteFn({ data: { difficultyId, vote } });
}

export async function qatComment(difficultyId: number, comment: string) {
   return qatCommentFn({ data: { difficultyId, comment } });
}

// requires QAT or comment moderation
export async function qatDeleteComment(difficultyId: number, commentId: number) {
   return qatDeleteCommentFn({ data: { difficultyId, commentId } });
}

// requires QAT or comment moderation
export async function qatEditComment(difficultyId: number, commentId: number, comment: string) {
   return qatEditCommentFn({ data: { difficultyId, commentId, comment } });
}

import { createServerFn } from '@tanstack/react-start';

import { api } from '@/shared/api/server-api';
import { actionApiVoid } from '@/shared/result/action';

const rtVoteFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { difficultyId: number; vote: 'UPVOTE' | 'DOWNVOTE' }) => data)
   .handler(({ data }) => actionApiVoid(api.ranking.rankingControllerRtVote({ id: data.difficultyId }, { vote: data.vote })));

const rtCommentFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { difficultyId: number; comment: string }) => data)
   .handler(({ data }) => actionApiVoid(api.ranking.rankingControllerRtComment({ id: data.difficultyId }, { comment: data.comment })));

const createRankRequestFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { mapId: number; description: string; leaderboardIds: number[] }) => data)
   .handler(({ data }) => actionApiVoid(api.ranking.rankingControllerCreateRequest(data)));

const rtDeleteCommentFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { difficultyId: number; commentId: number }) => data)
   .handler(({ data }) => actionApiVoid(api.ranking.rankingControllerRtDeleteComment({ id: data.difficultyId, commentId: data.commentId })));

const rtEditCommentFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { difficultyId: number; commentId: number; comment: string }) => data)
   .handler(({ data }) =>
      actionApiVoid(api.ranking.rankingControllerRtEditComment({ id: data.difficultyId, commentId: data.commentId }, { comment: data.comment }))
   );

export async function rtVote(difficultyId: number, vote: 'UPVOTE' | 'DOWNVOTE') {
   return rtVoteFn({ data: { difficultyId, vote } });
}

export async function rtComment(difficultyId: number, comment: string) {
   return rtCommentFn({ data: { difficultyId, comment } });
}

export async function createRankRequest(mapId: number, description: string, leaderboardIds: number[]) {
   return createRankRequestFn({ data: { mapId, description, leaderboardIds } });
}

// requires RT or comment moderation
export async function rtDeleteComment(difficultyId: number, commentId: number) {
   return rtDeleteCommentFn({ data: { difficultyId, commentId } });
}

// requires RT or comment moderation
export async function rtEditComment(difficultyId: number, commentId: number, comment: string) {
   return rtEditCommentFn({ data: { difficultyId, commentId, comment } });
}

<script lang="ts">
   import { userData } from '$lib/stores/global-store';

   import BaseMapInfo from '$lib/components/map/base-map-info.svelte';
   import FormattedDate from '$lib/components/common/formatted-date.svelte';

   import Permissions from '$lib/utils/permissions';
   import { getDifficultyStyle, getDifficultyLabel, getRankingApprovalStatus, getDifficultyOrStarValue } from '$lib/utils/helpers';

   import type { RankRequestInformation } from '$lib/models/Ranking';

   export let request: RankRequestInformation;

   const getStatusClass = (approved: number): string => {
      if (approved === 1) return 'approved';
      if (approved === 2) return 'denied';
      return 'pending';
   };
</script>

<BaseMapInfo
   coverImage={request.leaderboardInfo.coverImage}
   songName={request.leaderboardInfo.songName}
   songSubName={request.leaderboardInfo.songSubName}
   songAuthorName={request.leaderboardInfo.songAuthorName}
   levelAuthorName={request.leaderboardInfo.levelAuthorName}
   difficultyLabel={getDifficultyLabel(request.leaderboardInfo.difficulty)}
   difficultyStyle={getDifficultyStyle(request.leaderboardInfo.difficulty)}
   difficultyOrStarValue={getDifficultyOrStarValue(request.leaderboardInfo)}
   leaderboardId={request.leaderboardInfo.id}
>
   {#if $userData && Permissions.checkPermissionNumber($userData.permissions, Permissions.security.ADMIN)}
      <div class="info-row admin-info">
         <span class="info-label">Max PP:</span>
         <span class="info-value">{request.leaderboardInfo.maxPP}</span>
      </div>
   {/if}
   <div class="info-row">
      <span class="info-label">Status:</span>
      <span class="info-value status-badge {getStatusClass(request.approved)}">
         {getRankingApprovalStatus(request.approved)}
      </span>
   </div>
   <div class="info-row">
      <span class="info-label">Request Type:</span>
      <span class="info-value">{request.requestType == 1 ? 'Rank' : 'Unrank'}</span>
   </div>
   <div class="info-row">
      <span class="info-label">Created:</span>
      <span class="info-value"><FormattedDate date={new Date(request.created_at)} /></span>
   </div>
   <div class="votes-container">
      <div class="votes">
         <div class="vote">RT 👍<br /><b>{request.rankVotes.upvotes}</b></div>
         <div class="vote">RT 👎<br /><b>{request.rankVotes.downvotes}</b></div>
      </div>
      <div class="votes">
         <div class="vote">QAT 👍<br /><b>{request.qatVotes.upvotes}</b></div>
         <div class="vote">QAT ✅<br /><b>{request.qatVotes.neutral}</b></div>
         <div class="vote">QAT 👎<br /><b>{request.qatVotes.downvotes}</b></div>
      </div>
   </div>
</BaseMapInfo>

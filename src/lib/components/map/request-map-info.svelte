<script lang="ts">
   import type { RankRequestInformation } from '$lib/models/Ranking';
   import Permissions from '$lib/utils/permissions';
   import { getDifficultyStyle, getDifficultyLabel, getRankingApprovalStatus, getDifficultyOrStarValue } from '$lib/utils/helpers';
   import FormattedDate from '$lib/components/common/formatted-date.svelte';
   import type SearchView from '$lib/components/common/search.svelte';
   import { searchView, userData } from '$lib/stores/global-store';

   export let request: RankRequestInformation;
   let searchModal: SearchView;

   searchView.subscribe((v) => (searchModal = v));

   const openSearch = (val) => {
      searchModal?.setVisibility(true);
      searchModal?.search(val);
   };
</script>

<div class="card map-card">
   <div class="card-content window">
      <div class="media">
         <div class="media-content is-clipped">
            <div
               title={getDifficultyLabel(request.leaderboardInfo.difficulty)}
               class="tag mb-2 {getDifficultyStyle(request.leaderboardInfo.difficulty)}"
            >
               {getDifficultyOrStarValue(request.leaderboardInfo)}
            </div>
            <div class="title is-5 mb-0">
               <a href={`/leaderboard/${request.leaderboardInfo.id}`}>{request.leaderboardInfo.songName}</a>
            </div>
            {#if request?.leaderboardInfo?.songSubName?.length}
               <div class="title is-6 mb-0">
                  <a href={`/leaderboard/${request.leaderboardInfo.id}`}>{request.leaderboardInfo.songSubName}</a>
               </div>
            {/if}
            <div class="subtitle is-6">by {request.leaderboardInfo.songAuthorName}</div>
         </div>
         <div class="media-right">
            <figure class="image is-96x96 mr-0 ml-0">
               <img src={request.leaderboardInfo.coverImage} alt="Map Cover" class="map-cover" />
            </figure>
         </div>
      </div>

      <div class="content">
         {#if $userData && Permissions.checkPermissionNumber($userData.permissions, Permissions.security.ADMIN)}
            Max PP: <strong>{request.leaderboardInfo.maxPP}</strong> <br />
         {/if}
         Mapped by
         <a href={'#'} on:click|preventDefault={() => openSearch(request.leaderboardInfo.levelAuthorName)}
            ><b>{request.leaderboardInfo.levelAuthorName}</b></a
         ><br />
         Status: <strong>{getRankingApprovalStatus(request.approved)}</strong><br />
         Request Type: <strong>{request.requestType == 1 ? 'Rank' : 'Unrank'}</strong><br />
         Created: <strong><FormattedDate date={new Date(request.created_at)} /></strong><br />
         <hr />
         <div class="votes">
            <div class="vote">RT 👍<br /><b>{request.rankVotes.upvotes}</b></div>
            <div class="vote">RT 👎<br /><b>{request.rankVotes.downvotes}</b></div>
         </div>
         <div class="votes">
            <div class="vote">QAT 👍<br /><b>{request.qatVotes.upvotes}</b></div>
            <div class="vote">QAT 😐<br /><b>{request.qatVotes.neutral}</b></div>
            <div class="vote">QAT 👎<br /><b>{request.qatVotes.downvotes}</b></div>
         </div>
      </div>
   </div>
</div>

<style>
   hr {
      margin-top: 1rem;
      margin-bottom: 1rem;
      background-color: var(--dimmed);
   }

   .bg-image {
      position: absolute;
      height: 100%;
      width: 100%;
      background-position: 50% !important;
      background-repeat: no-repeat !important;
      background-size: cover !important;
      z-index: -1;
      border-radius: 5px;
   }

   .map-card {
      z-index: 1;
      color: var(--textColor);
      background: none;
   }

   .tag {
      font-size: xx-small;
      min-width: 20px;
      color: white;
      padding: 4px 4px 3px 4px;
      cursor: help;
   }

   .votes {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      align-items: center;
      margin-top: 0.8rem;
      text-align: center;
      gap: 0.5rem;
   }

   .vote {
      background-color: var(--foregroundItem);
      padding: 0.2rem 0.3rem;
      border-radius: 5px;
      flex-grow: 1;
   }

   .map-cover {
      border-radius: 5px;
   }

   .subtitle {
      display: block;
      color: var(--textColor);
      font-size: 14px;
      margin-top: 0.5rem !important;
   }
</style>

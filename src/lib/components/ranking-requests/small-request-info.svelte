<script lang="ts">
   import { searchView } from '$lib/stores/global-store';

   import type SearchView from '$lib/components/common/search.svelte';

   import type { RankRequestListing } from '$lib/models/Ranking';

   export let request: RankRequestListing;

   let searchModal: SearchView;

   let songName: string;
   $: songName = `${request.leaderboardInfo.songName}${request.leaderboardInfo.songSubName ? ' ' + request.leaderboardInfo.songSubName : ''}`;

   let truncatedSongName: string;
   $: truncatedSongName = songName.length < 30 ? songName : songName.slice(0, 29).trim() + '…';

   searchView.subscribe((v) => (searchModal = v));

   const openSearch = (val) => {
      searchModal?.setVisibility(true);
      searchModal?.search(val);
   };

   function membersNeeded(req: RankRequestListing) {
      if (!req || req.difficultyCount === 0) return -1;
      return Math.max(0, 3 - Math.floor(req.totalRankVotes.upvotes / req.difficultyCount));
   }

   function chooseGlowClass(req: RankRequestListing) {
      let needed = membersNeeded(req);
      if (req.totalRankVotes.downvotes + req.totalQATVotes.downvotes > 0) return '';
      if (needed > 1) return '';
      return needed === 1 ? 'one-member-needed' : 'no-member-needed';
   }
</script>

<div class="song-container">
   <div class="song-image-wrapper">
      <img
         class="song-image {chooseGlowClass(request)}"
         title={membersNeeded(request) === 0
            ? 'Ready for qualification!'
            : request.totalRankVotes.downvotes + request.totalQATVotes.downvotes > 0
            ? 'Request has downvotes'
            : membersNeeded(request) + ' RT member' + (membersNeeded(request) === 1 ? '' : 's') + ' needed'}
         src={request.leaderboardInfo.coverImage}
         alt="Cover"
      />
   </div>
   <div class="song-info-container">
      <div class="song-info">
         <a href={`/ranking/request/${request.requestId}`}>
            <span class="song-name" title={truncatedSongName !== songName ? songName : null}>{truncatedSongName}</span>
         </a>
         by
         <a href={'#'}>
            <span>
               {request.leaderboardInfo.songAuthorName.length < 30
                  ? request.leaderboardInfo.songAuthorName
                  : request.leaderboardInfo.songAuthorName.slice(0, 29).trim() + '…'}
            </span>
         </a>
      </div>
      <div class="mapper-info">
         mapped by
         <a href={'#'} on:click={() => openSearch(request.leaderboardInfo.levelAuthorName)}>
            <span class="mapper-name">
               {request.leaderboardInfo.levelAuthorName.length < 30
                  ? request.leaderboardInfo.levelAuthorName
                  : request.leaderboardInfo.levelAuthorName.slice(0, 29).trim() + '…'}
            </span>
         </a>
      </div>
   </div>
</div>

<style>
   .song-name {
      font-weight: 800;
      font-size: larger;
   }
   .song-image {
      min-width: 46px;
      width: 46px;
      height: 46px;
      border-radius: 15%;
      margin-right: 25px;
      display: block;
   }

   .song-info-container {
      display: flex;
      flex-direction: column;
   }
   .song-container {
      display: flex;
   }
   .song-image-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
   }

   .one-member-needed {
      box-shadow: 0 0 8px 2px #cfde49;
   }
   .no-member-needed {
      box-shadow: 0 0 8px 2px #58de49;
   }
   .downvoted {
      box-shadow: 0 0 8px 2px #de5149;
   }
</style>

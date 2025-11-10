<script type="ts">
   import { fly } from 'svelte/transition';

   import SmallSongInfo from '$lib/components/leaderboard/small-song-info.svelte';
   import FormattedDate from '$lib/components/common/formatted-date.svelte';
   import InlineLeaderboard from '$lib/components/leaderboard/inline-leaderboard.svelte';

   import { rankToPage } from '$lib/utils/helpers';

   import type { Score } from '$lib/models/LeaderboardData';
   import type { LeaderboardPlayer, Player, PlayerScore } from '$lib/models/PlayerData';

   import PlayerScoreComponent from './player-score.svelte';

   export let score: PlayerScore;
   export let row = 0;
   export let pageDirection = 1;
   export let openModal: (score: PlayerScore, player?: LeaderboardPlayer | Player) => void;
   export let expanded = false;
   export let playerId: string | undefined = undefined;

   let inlineLeaderboard: InlineLeaderboard;
   const initialPage = Math.ceil(score.score.rank / 12);

   $: if (expanded && inlineLeaderboard) {
      inlineLeaderboard.refresh(score.leaderboard.id.toString(), initialPage);
   }

   function modalOpen(newScore: Score) {
      openModal(
         {
            score: newScore,
            leaderboard: score.leaderboard
         },
         newScore.leaderboardPlayerInfo
      );
   }
</script>

<div
   class="table-item"
   style={`--row: ${row}`}
   in:fly|local={{ x: 100 * pageDirection, duration: 300, delay: 40 * (row - 1) }}
   out:fly|local={{ x: -100 * pageDirection, duration: 300, delay: 40 * (row - 1) }}
>
   <div class="background" style={`--bgURL: url(${score.leaderboard.coverImage})`} />
   <div>
      <div class="rank-info">
         <span>
            <i class="fas fa-globe-americas" title="Ranking" />
            <a title="Ranking" href={`/leaderboard/${score.leaderboard.id}?page=${rankToPage(score.score.rank, 12)}`}
               >#{score.score.rank.toLocaleString('en-US')}</a
            >
         </span>
         <FormattedDate short={true} date={score.score.timeSet} />
      </div>
   </div>
   <div>
      <div
         on:click={() => (expanded = !expanded)}
         on:keydown={(e) => e.key === 'Enter' && (expanded = !expanded)}
         class="arrowWrapper"
         role="button"
         tabindex="0"
      >
         <span class="arrow" class:active={expanded} />
      </div>
   </div>
   <div>
      <SmallSongInfo leaderboard={score.leaderboard} />
   </div>
   <div>
      <PlayerScoreComponent {openModal} {score} />
   </div>
   <div class="leaderboard" class:expanded>
      <InlineLeaderboard
         bind:this={inlineLeaderboard}
         leaderboardId={score.leaderboard.id.toString()}
         leaderboard={score.leaderboard}
         {initialPage}
         showScoreModal={modalOpen}
         playerHighlight={playerId}
         displayOver={true}
      />
   </div>
</div>

<style lang="scss">
   .rank-info {
      width: 100px;
      display: flex;
      flex-direction: column;
      text-align: center;
      height: 100%;
      justify-content: center;
   }

   .table-item {
      display: grid;
      grid-template-columns: 1fr 0.2fr 6fr 3fr;
      position: relative;
      grid-row: var(--row) / span 1;
      grid-column: 1;
      margin: 3px 0px;
      padding: 7px 0;
      border: 1px solid var(--borderColor);
      border-radius: 6px;

      > div {
         z-index: 1;

         &:not(.background, .leaderboard) {
            position: relative;
            grid-row: 1;
         }

         &:nth-child(2) {
            grid-column: 1;
            border-radius: 6px 0 0 6px;
            display: flex;
            align-items: center;
            height: 100%;
            margin: 0px;
         }

         &:nth-child(3) {
            grid-column: 2;
            padding: 12px 5px;
         }

         &:nth-child(4) {
            grid-column: 3;
            border-radius: 0 6px 6px 0;
            display: flex;
            align-items: center;
            height: 100%;
         }
      }

      .leaderboard {
         grid-row: 2;
         grid-column: 1 / span 4;
         max-height: 0px;
         transition: max-height var(--transitionTime) ease-out;
         overflow: hidden;
         position: relative;

         &.expanded {
            max-height: 800px;
            min-height: 200px;
            padding: 16px 8px;
            margin: 8px 8px 16px 8px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.1);
         }

         * {
            z-index: 1;
            position: relative;
         }
      }
   }

   .arrowWrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;

      &:hover {
         cursor: pointer;

         .arrow {
            &:before,
            &:after {
               background-color: var(--scoreSaberYellow);
            }
         }
      }

      .arrow {
         width: 13px;
         height: 13px;
         display: inline-block;
         position: relative;
         bottom: -5px;
         left: -10px;
         transition: 0.4s ease;
         margin-top: 2px;
         text-align: left;
         transform: rotate(45deg);

         &:before,
         &:after {
            position: absolute;
            content: '';
            display: inline-block;
            width: 12px;
            height: 3px;
            background-color: #fff;
            transition: 0.4s ease;
         }

         &:after {
            position: absolute;
            transform: rotate(90deg);
            top: -5px;
            left: 5px;
         }

         &.active {
            transform: rotate(45deg) translate(-5px, -5px);

            &:before {
               transform: translate(10px, 0);
            }

            &:after {
               transform: rotate(90deg) translate(10px, 0);
            }
         }
      }
   }

   .fas.fa-globe-americas {
      height: 11px;
      width: 16px;
      cursor: help;
   }

   .background {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-position: 50% !important;
      background-repeat: no-repeat !important;
      background-size: cover !important;
      z-index: 0;
      border-radius: 6px;
      background: linear-gradient(to left, rgba(12, 12, 15, 0.92), rgba(22, 27, 34, 0.95)) repeat scroll 0% 0%,
         rgba(0, 0, 0, 0) var(--bgURL) repeat scroll 0% 0%;
      filter: blur(8px);
      -webkit-filter: blur(8px);
      backdrop-filter: blur(8px) saturate(120%);
      -webkit-backdrop-filter: blur(8px) saturate(120%);
   }

   @media only screen and (max-width: 768px) {
      .table-item {
         grid-template-columns: 20px 1fr;
         padding: 12px;

         > div:not(.background, .leaderboard) {
            grid-row: 2 !important;
         }

         > div:nth-child(2) {
            grid-row: 1 !important;
            grid-column: 1 / span 2;

            .rank-info {
               flex-flow: row nowrap;
               justify-content: space-between;
               width: 100%;
            }
         }

         > div:nth-child(3) {
            grid-column: 1;
         }

         > div:nth-child(4) {
            grid-column: 2;
         }

         > div:nth-child(5) {
            grid-row: 3 !important;
            grid-column: 1 / span 2;
            display: flex;
            flex-flow: row wrap;
            justify-content: center;

            > div {
               display: contents;
            }
         }

         .leaderboard {
            grid-row: 4 !important;
         }
      }
   }
</style>

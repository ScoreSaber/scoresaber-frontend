<script lang="ts">
   import { onDestroy, onMount } from 'svelte';

   import { modal, setBackground } from '$lib/stores/global-store';

   import Loader from '$lib/components/common/loader.svelte';
   import Modal, { bind } from '$lib/components/common/modal.svelte';
   import PlayerLink from '$lib/components/player/player-link.svelte';
   import Score from '$lib/components/player/score.svelte';
   import ScoreModal from '$lib/components/player/score-modal.svelte';

   import { HMDs } from '$lib/utils/helpers';

   import type { IWebSocketMessage } from '$lib/models/Live';
   import type { LeaderboardPlayer, Player, PlayerScore } from '$lib/models/PlayerData';

   setBackground('/images/banner.jpg');

   // Websocket handler (maybe convert to store?)
   let socket: WebSocket;
   onMount(() => {
      socket = new WebSocket('wss://scoresaber.com/ws');

      socket.addEventListener('open', () => {
         connected = true;
      });

      socket.addEventListener('close', () => {
         connected = false;
      });

      socket.addEventListener('message', (message: any) => {
         parseWebSocketMessage(message.data);
      });
   });

   onDestroy(() => {
      if (socket) {
         socket.close();
      }
   });

   // Actual page logic
   $: connected = false;
   let playerScores: PlayerScore[] = [];

   function parseWebSocketMessage(message: string) {
      if (message == 'Connected to the ScoreSaber WSS') {
         console.log('Connected to score service');
         return;
      }
      const parsedMessage: IWebSocketMessage = JSON.parse(message);
      switch (parsedMessage.commandName) {
         case 'score':
            handleScoreCommand(parsedMessage);
            break;
      }
   }

   function handleScoreCommand(parsedMessage: IWebSocketMessage) {
      const playerScore: PlayerScore = parsedMessage.commandData as PlayerScore;
      if (playerScores.length >= 12) {
         playerScores.pop();
      }
      playerScores.unshift(playerScore);
      playerScores = playerScores;
   }

   function openScoreModal(score: PlayerScore, player?: LeaderboardPlayer | Player) {
      modal.set(bind(ScoreModal, { player: player, score: score }));
   }
</script>

<head>
   <title>Live Score Feed | ScoreSaber!</title>
</head>

<div class="scores-page">
   <div class="scores-container">
      <div class="scores-card">
         <div class="scores-header">
            <h1 class="scores-title">ScoreSaber Live Score Feed</h1>
            <div class="connection-status" class:connected>
               <div class="status-dot" />
               <span>{connected ? 'Connected' : 'Connecting...'}</span>
            </div>
         </div>
         <div class="scores-description">
            <p>Watch scores being uploaded to ScoreSaber in real-time</p>
            <p class="scores-note">Note: This does not include scores submitted from versions of Beat Saber before 1.20</p>
         </div>
      </div>

      <div class="scores-card">
         {#if !connected}
            <div class="scores-loading">
               <Loader />
            </div>
         {:else}
            <div class="scores-list">
               {#each playerScores ?? [] as score, i (score.score.id)}
                  <div class="live-score-wrapper">
                     <div class="live-score-header">
                        <img
                           src={score.score.leaderboardPlayerInfo.profilePicture}
                           alt={score.score.leaderboardPlayerInfo.name}
                           title={score.score.leaderboardPlayerInfo.name}
                           class="player-avatar"
                        />
                        <div class="player-info">
                           <PlayerLink player={score.score.leaderboardPlayerInfo} destination={`/u/${score.score.leaderboardPlayerInfo.id}`} />
                           <span class="device-info">
                              {#if score.score.deviceHmd}
                                 on {score.score.deviceHmd}
                              {:else}
                                 on {HMDs[score.score.hmd]}
                              {/if}
                           </span>
                        </div>
                     </div>
                     <div class="score-container">
                        <Score openModal={openScoreModal} {score} row={i + 1} playerId={score.score.leaderboardPlayerInfo.id} />
                     </div>
                  </div>
               {/each}
               {#if playerScores.length == 0}
                  <div class="scores-empty">
                     <i class="fa fa-rss" />
                     <p>Waiting for new scores...</p>
                  </div>
               {/if}
            </div>
         {/if}
      </div>
   </div>
</div>

<Modal show={$modal} />

<style>
   .scores-page {
      padding: 2rem 1.5rem;
   }

   .scores-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
   }

   .scores-card {
      background: var(--foreground);
      border: 1px solid var(--borderColor);
      border-radius: 0.9rem;
      padding: 2rem;
   }

   .scores-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 1rem;
   }

   .scores-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--textColor);
      margin: 0;
   }

   .connection-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.6);
   }

   .connection-status.connected {
      color: var(--success);
   }

   .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      animation: pulse 2s ease-in-out infinite;
   }

   .connection-status.connected .status-dot {
      background: var(--success);
      animation: none;
   }

   @keyframes pulse {
      0%,
      100% {
         opacity: 1;
      }
      50% {
         opacity: 0.5;
      }
   }

   .scores-description {
      margin-top: 1rem;
   }

   .scores-description p {
      margin: 0 0 0.5rem 0;
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.6;
   }

   .scores-note {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.6);
   }

   .scores-loading {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 3rem;
   }

   .scores-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
   }

   .live-score-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
   }

   .score-container {
      /* Ensure Score component renders with its original styling */
      isolation: isolate;
      color: var(--textColor);
   }

   .score-container :global(.table-item) {
      color: var(--textColor);
   }

   .score-container :global(*) {
      /* Reset any inherited styles that might interfere */
      box-sizing: border-box;
   }

   .live-score-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
   }

   .player-avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid var(--borderColor);
   }

   .player-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1;
   }

   .device-info {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.6);
   }

   .scores-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      color: rgba(255, 255, 255, 0.5);
      text-align: center;
   }

   .scores-empty i {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      opacity: 0.5;
   }

   .scores-empty p {
      margin: 0;
      font-size: 1rem;
   }

   @media (max-width: 768px) {
      .scores-page {
         padding: 1.5rem 1rem;
      }

      .scores-card {
         padding: 1.5rem;
      }

      .scores-title {
         font-size: 1.5rem;
      }

      .scores-header {
         flex-direction: column;
         align-items: flex-start;
      }
   }
</style>

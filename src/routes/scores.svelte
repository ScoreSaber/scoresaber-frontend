<script lang="ts">
   import { onDestroy, onMount } from 'svelte';

   import Loader from '$lib/components/common/loader.svelte';
   import Modal, { bind } from '$lib/components/common/modal.svelte';
   import PlayerLink from '$lib/components/player/player-link.svelte';
   import Score from '$lib/components/player/score.svelte';
   import ScoreModal from '$lib/components/player/score-modal.svelte';
   import { modal } from '$lib/stores/global-store';
   import { setBackground } from '$lib/stores/global-store';
   import type { IWebSocketMessage } from '$lib/models/Live';
   import type { LeaderboardPlayer, Player, PlayerScore } from '$lib/models/PlayerData';
   import { HMDs } from '$lib/utils/helpers';

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

<div class="section">
   <div class="window-header">ScoreSaber Live Score Feed</div>
   <div class="window has-shadow">
      <div class="content">
         Here you can see every score that is being uploaded to ScoreSaber in realtime! <br />
         Please keep in mind this does not include scores submitted from versions of Beat Saber before 1.20
      </div>
   </div>
   <div class="window has-shadow">
      <div class="content">
         {#if !connected}
            <Loader />
         {:else}
            <div class="ranking songs">
               <div class="ranking songs gridTable">
                  {#each playerScores ?? [] as score, i (score.score.id)}
                     <div class="live-score">
                        <div class="ml-1 live-score-player">
                           <img
                              src={score.score.leaderboardPlayerInfo.profilePicture}
                              alt={score.score.leaderboardPlayerInfo.name}
                              title={score.score.leaderboardPlayerInfo.name}
                              class="image rounded is-24x24"
                           />
                           <span>
                              <b>
                                 <PlayerLink player={score.score.leaderboardPlayerInfo} destination={`/u/${score.score.leaderboardPlayerInfo.id}`} />
                              </b>
                              on {HMDs[score.score.hmd]}
                           </span>
                        </div>
                        <Score openModal={openScoreModal} {score} row={i + 1} playerId={score.score.leaderboardPlayerInfo.id} />
                     </div>
                  {/each}
                  {#if playerScores.length == 0}
                     Waiting for new scores...
                  {/if}
               </div>
            </div>
         {/if}
      </div>
   </div>
</div>

<Modal show={$modal} />

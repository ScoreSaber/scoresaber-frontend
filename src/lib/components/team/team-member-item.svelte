<script lang="ts">
   import type { TeamMember } from '$lib/models/ScoreSaberTeam';
   export let teamMember: TeamMember;

   const position = '';
</script>

<div class="column is-one-quarter">
   <div class="columns is-mobile">
      <div class="column is-narrow avatar">
         <img
            class="image is-60x60"
            src="https://raw.githubusercontent.com/Umbranoxio/ScoreSaber-Team/main/images/{teamMember.ProfilePicture}"
            alt={teamMember.Name}
         />
      </div>
      <div class="column">
         <h5 class="title is-6">{teamMember.Name}</h5>
         <h6 class="subtitle">{position}</h6>
         {#if teamMember.Discord}
            <a href="https://discordapp.com/users/{teamMember.Discord}" rel="external">
               <span class="icon">
                  <i class="fab fa-discord" />
               </span>
            </a>
         {/if}
         {#if teamMember.Twitter}
            <a href="https://twitter.com/{teamMember.Twitter}" rel="external">
               <span class="icon">
                  <i class="fab fa-twitter" />
               </span>
            </a>
         {/if}
         {#if teamMember.Twitch}
            <a href="https://twitch.tv/{teamMember.Twitch}" rel="external">
               <span class="icon">
                  <i class="fab fa-twitch" />
               </span>
            </a>
         {/if}
         {#if teamMember.YouTube}
            <a href="https://youtube.com/channel/{teamMember.YouTube}" rel="external">
               <span class="icon">
                  <i class="fab fa-youtube" />
               </span>
            </a>
         {/if}
         {#if teamMember.GitHub}
            <a href="https://github.com/{teamMember.GitHub}" rel="external">
               <span class="icon">
                  <i class="fab fa-github" />
               </span>
            </a>
         {/if}
      </div>
   </div>
</div>

<style>
   .image.is-60x60 {
      border-radius: 50%;
      height: 60px;
      width: 60px;
   }
</style>

<script lang="ts">
   import type { TeamMember } from '$lib/models/ScoreSaberTeam';
   export let teamMember: TeamMember;
   export let teamColorClass = 'default';

   const playerOverrides: Record<string, string> = {
      umbranox: 'pink',
      qwasyx: 'gay',
      williums: 'gay'
   };

   function getPlayerClass(name: string, baseClass: string): string {
      return playerOverrides[name.toLowerCase()] ?? baseClass;
   }

   $: finalColorClass = getPlayerClass(teamMember.Name, teamColorClass);
   $: teamColor = getTeamColor(finalColorClass);

   const teamColorMap: Record<string, string> = {
      panda: 'var(--panda)',
      pink: 'var(--panda)',
      admin: 'var(--admin)',
      nat: 'var(--nat)',
      rt: 'var(--rt)',
      qat: 'var(--qat)',
      cat: 'var(--cat)',
      dev: 'var(--dev)',
      ppv3: 'var(--ppv3)',
      cct: 'var(--cct)',
      mod: 'var(--scoreSaberYellow)'
   };

   function getTeamColor(colorClass: string): string {
      return teamColorMap[colorClass] ?? 'var(--scoreSaberYellow)';
   }

   $: socialLinks = [
      {
         platform: 'Discord',
         url: teamMember.Discord ? `https://discordapp.com/users/${teamMember.Discord}` : null,
         icon: 'fab fa-discord',
         label: 'Discord'
      },
      { platform: 'Twitter', url: teamMember.Twitter ? `https://twitter.com/${teamMember.Twitter}` : null, icon: 'fab fa-twitter', label: 'Twitter' },
      { platform: 'Twitch', url: teamMember.Twitch ? `https://twitch.tv/${teamMember.Twitch}` : null, icon: 'fab fa-twitch', label: 'Twitch' },
      {
         platform: 'YouTube',
         url: teamMember.YouTube ? `https://youtube.com/channel/${teamMember.YouTube}` : null,
         icon: 'fab fa-youtube',
         label: 'YouTube'
      },
      { platform: 'GitHub', url: teamMember.GitHub ? `https://github.com/${teamMember.GitHub}` : null, icon: 'fab fa-github', label: 'GitHub' }
   ].filter((link) => link.url);
</script>

<div class="column is-6-mobile is-4-tablet is-3-desktop team-member-column">
   <div class="team-member-card {finalColorClass === 'gay' ? 'gay-border' : ''}" style="--team-color: {teamColor}">
      <div class="team-member-content">
         <div class="avatar-wrapper {finalColorClass === 'gay' ? 'gay-border' : ''}">
            <img
               class="avatar-image"
               src="https://raw.githubusercontent.com/Umbranoxio/ScoreSaber-Team/main/images/{teamMember.ProfilePicture}"
               alt={teamMember.Name}
            />
         </div>
         <div class="member-info">
            <h5
               class="member-name {finalColorClass === 'gay' ? 'gay' : ''}"
               style="color: {finalColorClass === 'default' ? 'var(--alternate)' : finalColorClass === 'gay' ? 'transparent' : teamColor}"
            >
               {#if teamMember.ScoreSaberID}
                  <a href={`/u/${teamMember.ScoreSaberID}`}>
                     {teamMember.Name}
                  </a>
               {:else}
                  {teamMember.Name}
               {/if}
            </h5>
            {#if socialLinks.length > 0}
               <div class="social-links">
                  {#each socialLinks as link}
                     <a href={link.url} rel="external" class="social-link" aria-label={link.label}>
                        <span class="icon">
                           <i class={link.icon} />
                        </span>
                     </a>
                  {/each}
               </div>
            {/if}
         </div>
      </div>
   </div>
</div>

<style>
   :global(:root) {
      --rainbow-gradient: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet, indigo, blue, green, yellow, orange, red);
   }

   .team-member-card {
      background-color: var(--foregroundItem);
      border: 1px solid var(--borderColor);
      border-radius: 8px;
      padding: 0.875rem;
      transition: all var(--transitionTime);
      display: flex;
      flex-direction: column;
   }

   .team-member-card:hover {
      border-color: var(--team-color);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
   }

   .team-member-content {
      display: flex;
      align-items: flex-start;
      gap: 0.875rem;
      padding-top: 0.125rem;
   }

   .avatar-wrapper {
      position: relative;
      width: 52px;
      height: 52px;
      flex-shrink: 0;
   }

   .avatar-image {
      position: relative;
      border-radius: 50%;
      height: 100%;
      width: 100%;
      object-fit: cover;
      border: 2px solid var(--borderColor);
      transition: border-color var(--transitionTime);
      z-index: 1;
   }

   .avatar-wrapper.gay-border {
      width: 52px;
      height: 52px;
   }

   .avatar-wrapper.gay-border .avatar-image {
      border: none;
      border-radius: 0;
   }

   .team-member-card:hover .avatar-image {
      border-color: var(--team-color);
   }

   .member-info {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      padding-top: 0.125rem;
   }

   .member-name {
      color: var(--textColor);
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0;
      padding-left: 0.375rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
   }

   .member-name a {
      color: inherit;
      text-decoration: none;
   }

   @keyframes rainbowScroll {
      0% {
         background-position: 300px 0;
      }
      100% {
         background-position: 0 0;
      }
   }

   .member-name.gay {
      width: max-content;
      background: var(--rainbow-gradient);
      background-size: 300px 100%;
      animation: rainbowScroll 8s linear infinite;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
   }

   .team-member-card.gay-border {
      border-color: transparent;
      position: relative;
      isolation: isolate;
   }

   .team-member-card.gay-border::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 8px;
      background: var(--rainbow-gradient);
      background-size: 300px 100%;
      animation: rainbowScroll 8s linear infinite;
      pointer-events: none;
      opacity: 0;
      transition: opacity var(--transitionTime);
      z-index: -1;
   }

   .team-member-card.gay-border::after {
      content: '';
      position: absolute;
      inset: 1px;
      border-radius: 7px;
      background: var(--foregroundItem);
      pointer-events: none;
      z-index: -1;
   }

   .team-member-card.gay-border:hover::before {
      opacity: 1;
   }

   .social-links {
      display: flex;
      flex-wrap: nowrap;
      gap: 0.125rem;
      margin-top: 0.5rem;
      min-width: 0;
   }

   .social-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--textColor);
      transition: all 0.3s ease;
      opacity: 0.7;
      border-radius: 4px;
      padding: 0.125rem;
   }

   .social-link:hover {
      color: var(--team-color);
      opacity: 1;
   }

   .team-member-card.gay-border .social-link:hover .icon i {
      background: var(--rainbow-gradient);
      background-size: 300px 100%;
      animation: rainbowScroll 8s linear infinite;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
   }

   .team-member-scoresaber-unprovided {
      cursor: default;
   }

   .social-link .icon {
      font-size: 0.875rem;
      flex-shrink: 0;
      width: 1.375rem;
      height: 1.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
   }

   .team-member-column {
      min-width: 0;
   }

   @media (min-width: 1024px) and (max-width: 1199px) {
      .team-member-column {
         max-width: 33.3333% !important;
         flex: 0 0 33.3333% !important;
      }
   }

   @media (max-width: 756px) {
      .team-member-card {
         padding: 0.5rem;
      }

      .team-member-content {
         gap: 0.375rem;
         padding-top: 0;
         flex-direction: row;
         align-items: center;
      }

      .avatar-wrapper,
      .avatar-wrapper.gay-border {
         width: 36px;
         height: 36px;
      }

      .member-info {
         padding-top: 0;
         flex: 1;
         min-width: 0;
      }

      .member-name {
         font-size: 0.8rem;
         padding-left: 0;
         margin-bottom: 0.125rem;
      }

      .social-link {
         padding: 0;
      }

      .social-link .icon {
         font-size: 0.75rem;
         width: 1.0625rem;
         height: 1.0625rem;
      }

      .social-links {
         gap: 0;
         margin-top: 0.125rem;
      }
   }

   @media (min-width: 769px) and (max-width: 1023px) {
      .avatar-wrapper,
      .avatar-wrapper.gay-border {
         width: 50px;
         height: 50px;
      }

      .member-name {
         font-size: 0.95rem;
      }
   }

   @media (min-width: 757px) and (max-width: 768px) {
      .avatar-wrapper,
      .avatar-wrapper.gay-border {
         width: 48px;
         height: 48px;
      }

      .member-name {
         font-size: 0.9rem;
      }

      .social-link .icon {
         font-size: 0.8rem;
         width: 1.25rem;
         height: 1.25rem;
      }
   }
</style>

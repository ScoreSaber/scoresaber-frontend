<script lang="ts">
   import { browser } from '$app/env';

   import type { AccioError } from '$lib/utils/accio';

   export let error: AccioError;
   export let fullpage = false;

   if (browser && error.status !== 404) {
      console.error(error);
   }
</script>

<div class="error {fullpage ? 'fullpage' : ''}" class:is-404={error.status === 404}>
   <div class="error-icon">
      {#if error.status === 404}
         <i class="fas fa-search" />
      {:else}
         <i class="fas fa-exclamation-triangle" />
      {/if}
   </div>
   <div class="error-content">
      {#if error.status == 404}
         <h1>Not Found</h1>
         {#if error.message}
            <p class="error-message">{error.message}</p>
         {:else}
            <p class="error-message">The requested resource could not be found.</p>
         {/if}
      {:else if error.status == 503}
         <h1>Service Unavailable</h1>
         <p class="error-message">{error.message}</p>
      {:else}
         <h1>Error {error.status ?? ''}</h1>
         <p class="error-message">Looks like something's gone wrong.</p>
         <p class="status">Error info has been logged to console.</p>
      {/if}
   </div>
</div>

<style lang="scss">
   .error {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
      text-align: center;
      gap: 1rem;
   }

   .error-icon {
      font-size: 3rem;
      color: var(--danger);
      opacity: 0.8;
      animation: pulse 2s ease-in-out infinite;
   }

   .error.is-404 .error-icon {
      color: var(--textColor);
      opacity: 0.5;
      animation: none;
   }

   @keyframes pulse {
      0%,
      100% {
         opacity: 0.8;
      }
      50% {
         opacity: 0.5;
      }
   }

   .error-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
   }

   h1 {
      font-size: 2rem;
      font-weight: 600;
      color: var(--textColor);
      margin: 0;
   }

   .error-message {
      font-size: 1rem;
      color: var(--textColor);
      opacity: 0.8;
      margin: 0;
   }

   .status {
      font-size: 0.875rem;
      opacity: 0.5;
      font-style: italic;
      margin: 0.5rem 0 0 0;
   }

   .error.fullpage {
      min-height: 50vh;
      padding: 4rem 3rem;

      .error-icon {
         font-size: 4rem;
      }

      h1 {
         font-size: 3rem;
      }

      .error-message {
         font-size: 1.25rem;
      }
   }

   @media (max-width: 512px) {
      .error {
         padding: 1.5rem 1rem;
      }

      .error-icon {
         font-size: 2.5rem;
      }

      h1 {
         font-size: 1.5rem;
      }

      .error-message {
         font-size: 0.9rem;
      }

      .error.fullpage {
         min-height: 40vh;
         padding: 3rem 2rem;

         .error-icon {
            font-size: 3rem;
         }

         h1 {
            font-size: 2rem;
         }

         .error-message {
            font-size: 1rem;
         }
      }
   }
</style>

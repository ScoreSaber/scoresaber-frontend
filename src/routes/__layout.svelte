<script lang="ts">
   import fetcher from '$lib/utils/fetcher';
   import poster from '$lib/utils/poster';
   import type { UserData, TokenResponse } from '$lib/models/UserData';
   import { userData } from '$lib/global-store';
   import { useAccio } from '$lib/utils/accio';

   let tokenCheckAttempts: number = 0;

   async function onUserCheckSuccess() {
      userData.set($user);
      const token = await fetcher<TokenResponse>('/api/auth/getToken', { withCredentials: true });
      localStorage.setItem('login-token', token.token);
      console.log(`Logged in as ${$user.playerId}`);
   }

   async function onUserCheckFailed() {
      let token = localStorage.getItem('login-token');
      if (token != undefined) {
         if (tokenCheckAttempts < 3) {
            const result = await poster('/api/auth/checkToken', { token: token }, { withCredentials: true });
            if (result.status === 200) {
               refreshLogin({ forceRevalidate: true });
               tokenCheckAttempts++;
            } else {
               localStorage.removeItem('login-token');
            }
         }
      }
   }

   const {
      data: user,
      error: loginError,
      refresh: refreshLogin
   } = useAccio<UserData>('/api/user/@me', { fetcher, onSuccess: onUserCheckSuccess, onError: onUserCheckFailed, ignoreSubscriptions: true });
</script>

<slot />

<style lang="scss" global>
   html {
      overflow: auto;
   }
</style>

<script lang="ts">
   import { onMount } from 'svelte';
   import { userData } from '$lib/stores/global-store';
   import permissions from '$lib/utils/permissions';
   import type { LeaderboardInfo } from '$lib/models/LeaderboardData';
   export let leaderboardInfo: LeaderboardInfo;
   $: showAd = true;
   const opts = {
      artist: leaderboardInfo.songAuthorName,
      song: leaderboardInfo.songName,
      adunit_id: 100004454,
      div_id: 'cf_async_' + Math.floor(Math.random() * 999999999)
   };
   onMount(() => {
      userData.subscribe((u) => {
         if (u) {
            if (permissions.checkPermissionNumber(u.permissions, permissions.security.SUPPORTER)) {
               showAd = false;
            } else {
               runAd();
            }
         } else {
            runAd();
         }
      });
   });
   function runAd() {
      var c = function () {
         window.cf.showAsyncAd(opts);
         const adElement = document.getElementsByClassName('cf_class')[0];
         console.log(adElement);
      };
      if (typeof window.cf !== 'undefined') {
         c();
      } else {
         var r = document.createElement('script'),
            s = document.getElementsByTagName('script')[0];
         r.async = !0;
         r.src = '//srv.tunefindforfans.com/fruits/apricots.js';
         r.readyState
            ? (r.onreadystatechange = function () {
                 console.log(r.readyState);
                 if ('loaded' == r.readyState || 'complete' == r.readyState) (r.onreadystatechange = null), c();
              })
            : (r.onload = c);
         s.parentNode.insertBefore(r, s);
      }
      let adStyleOverride = setInterval(() => {
         const adElements = document.getElementsByClassName('cf_class');
         if (adElements) {
            Array.from(adElements).forEach(function (item: HTMLElement) {
               if (item.style.color == 'rgb(0, 0, 0)') {
                  item.style.color = '#fff';
                  clearInterval(adStyleOverride);
               }
            });
         }
      }, 100);
   }
</script>

{#if showAd}
   <div id={opts.div_id} />
{/if}

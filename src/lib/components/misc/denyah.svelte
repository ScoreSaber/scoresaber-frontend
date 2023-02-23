<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
 
    export let playerId: string;
 
    onMount(() => {
        denyah()
    });

    $: $page.path, denyah()

    function denyah() {
        const page = document.getElementById("page");
        if (page) {
          if (playerId == "76561198064659288") {
            page.style.transform = "rotateZ(8deg)";
            page.style.filter = "blur(1px) hue-rotate(180deg)";
            page.style.cursor = "wait";
            setInterval(async () => {
              page.style.transform = "rotateZ(188deg)";
              await new Promise((resolve) => setTimeout(resolve, 2000));
              page.style.transform = "rotateZ(8deg)";
            }, 13000);
          } else {
            page.style.transform = "rotateZ(0deg)";
            page.style.filter = "blur(0px)";
            page.style.cursor = "default";
          }
        }
      }      
 </script>
 

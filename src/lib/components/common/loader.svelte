<script lang="ts">
   export let displayOver: boolean = false;
</script>

<div class="columns is-centered" class:displayOver>
   <img alt="loading" class="scoresaber-loader" src="/images/logo.svg" />
</div>

<style>
   .displayOver {
      position: absolute;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
   }
   .scoresaber-loader {
      animation: loading 2s ease infinite;
      height: 48px;
      width: 48px;
      margin: 30px 0;
   }
   .columns {
      display: flex;
   }
   @keyframes loading {
      0% {
         transform: perspective(120px) rotateX(0deg) rotateY(0deg);
      }
      50% {
         transform: perspective(120px) rotateX(0deg) rotateY(-180deg);
      }
      100% {
         transform: perspective(120px) rotateX(0deg) rotateY(-359deg);
      }
   }
</style>

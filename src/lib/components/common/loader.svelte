<script lang="ts">
   export let displayOver = false;
</script>

<div class="columns is-centered" class:displayOver>
   <img alt="loading" class="scoresaber-loader" src="/images/logo.svg" />
</div>

<style lang="scss">
   .displayOver {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 99;
      img {
         margin-top: 100px;
      }
   }
   .scoresaber-loader {
      animation: loading 2s ease infinite;
      height: 48px;
      width: 48px;
      margin: 30px 0;
   }

   @supports (-webkit-touch-callout: none) {
      // loading animation for ios
      @keyframes loading {
         0% {
            transform: rotate(0deg);
         }
         100% {
            transform: rotate(360deg);
         }
      }
   }

   @supports not (-webkit-touch-callout: none) {
      // loading animation for literally everythings else
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
   }

   .columns {
      display: flex;
   }
</style>

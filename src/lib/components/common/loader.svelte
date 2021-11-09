<div class="columns is-centered">
   <img alt="loading" class="scoresaber-loader" src="/images/logo.svg" />
</div>

<style>
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

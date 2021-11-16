<footer class="site-footer">
   <div class="container ">
      <a class="logoSection" href="/">
         <img src="/images/logo.svg" alt="" class="logo" />
         ScoreSaber
      </a>
      <p>
         <strong>ScoreSaber</strong> by <a href="https://twitter.com/Umbranoxus">Umbranox</a> &amp;
         <a href="/team">Team</a>
      </p>
      <nav class="social">
         <a href="https://discord.gg/scoresaber" title="Join our Discord!" class="square"><i class="fab fa-discord fa-2x" /></a>
         <a href="https://www.patreon.com/scoresaber" title="Support us on Patreon ❤️" class="square"><i class="fab fa-patreon fa-2x" /></a>
         <a href="https://twitter.com/scoresaber" title="Follow us on Twitter" class="square"><i class="fab fa-twitter fa-2x" /></a>
      </nav>
      <p>
         <a href="https://scoresaber.com/legal/privacy">Privacy Policy</a>
      </p>
   </div>
</footer>

<style type="scss">
   .site-footer {
      background: #1c1c1c;
      font-size: 1.25em;
      padding: 3rem;
      --slice-height: 18vh;
      padding-top: calc(3rem + var(--slice-height));
      clip-path: polygon(0 var(--slice-height), 100% 0, 100% 100%, 0 100%);
      margin-top: calc(-20vh - 90px);
      z-index: -1;
   }

   .logoSection {
      display: flex;
      height: 2em;
      font-size: 1.5em;
      gap: 10px;
      margin-bottom: 1em;
      align-items: center;
      color: var(--scoreSaberYellow);
      font-weight: 600;
   }

   .social {
      display: flex;
      gap: 15px;
      padding: 15px 0;
   }

   .social a {
      color: inherit;
      display: block;
      &:hover {
         color: var(--scoreSaberYellow);
      }
   }

   .logoSection > img {
      height: inherit;
   }
</style>

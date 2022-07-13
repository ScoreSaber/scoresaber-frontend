<script lang="ts">
   import { setBackground } from '$lib/stores/global-store';

   import Timeline, { type TimelineSteps } from '$lib/components/timeline/timeline.svelte';

   setBackground('/images/banner.jpg');

   const steps: TimelineSteps = [
      {
         title: '',
         accentColour: 'var(--success)',
         content: 'First reweight',
         isCompleted: true,
         time: new Date(Date.UTC(2022, 2, 23, 19))
      },
      {
         title: '',
         accentColour: 'var(--success)',
         content: 'Begin curve change discussion',
         isCompleted: true,
         time: new Date(Date.UTC(2022, 2, 26, 19))
      },
      {
         title: '',
         accentColour: 'var(--success)',
         content: 'Second reweight with curve change',
         isCompleted: true,
         time: new Date(Date.UTC(2022, 2, 30, 19))
      },
      {
         title: '',
         accentColour: 'var(--success)',
         content: 'Third reweight',
         isCompleted: true,
         time: new Date(Date.UTC(2022, 3, 15, 4))
      },
      {
         title: '',
         accentColour: 'var(--scoreSaberYellow)',
         content: 'Fourth reweight',
         isCompleted: true,
         time: new Date(Date.UTC(2022, 4, 21, 19))
      }
   ];
</script>

<head>
   <title>PPv2.9 Timeline</title>
</head>
<div class="section">
   <div class="container">
      <div class="window-header">PPv2.9 Progress Page</div>
      <div class="window has-shadow">
         <div class="content">
            Every ranked map on ScoreSaber has been assigned a new PP value by a tool written by our PPv3 team which reweights all ranked maps based
            on player performance. An AI has been trained on this data and will be used in all future weightings for new ranked maps with possible
            correction by the reweighting tool after awhile.<br /><br />
            This is a multistage process and all maps will go through 3 rounds of reweighting to help improve our AI, this page is to track PPv2.9's progress.
            PPv2.9 shouldn't be considered done until each step on this page is marked as completed<br /> <br />

            A form has been created for players to submit maps that may be considered over/underweighted so they can be tuned by our internal tools
            <a href="https://forms.gle/jhYZTGuRHdtfYy7K6">here</a>
         </div>
      </div>
      <div class="window has-shadow">
         <div class="content">
            <Timeline {steps} />
         </div>
      </div>
   </div>
</div>

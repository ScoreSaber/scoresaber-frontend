<script lang="ts">
   import Timeline, { TimelineSteps } from '$lib/components/timeline/timeline.svelte';
   import { setBackground } from '$lib/global-store';
   setBackground('/images/banner.jpg');
   const steps: TimelineSteps = [
      {
         title: '',
         accentColour: 'var(--scoreSaberYellow)',
         content: 'First reweight - Thursday, March 24th UTC',
         isCompleted: true
      },
      {
         title: '',
         accentColour: 'var(--scoreSaberYellow)',
         content: 'Begin curve change discussions - 7:00pm, Saturday, March 26th UTC',
         isCompleted: false
      },
      {
         title: '',
         accentColour: 'var(--scoreSaberYellow)',
         content: 'Second reweight with curve change - 7:00pm, Sunday, March 27th UTC',
         isCompleted: false
      },
      {
         title: '',
         accentColour: 'var(--scoreSaberYellow)',
         content: 'Third reweight - 7:00pm, Sunday, April 3rd UTC',
         isCompleted: false
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
            Once the dust has settled, a form will be created for users to submit maps that may be considered overweighted so they can be tuned by our
            internal tools.
         </div>
      </div>
      <div class="window has-shadow">
         <div class="content">
            <Timeline {steps} />
         </div>
      </div>
   </div>
</div>

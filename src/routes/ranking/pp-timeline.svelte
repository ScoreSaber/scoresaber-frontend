<script lang="ts">
   import Timeline, { TimelineSteps } from '$lib/components/timeline/timeline.svelte';
   const steps: TimelineSteps = new Array(10)
      .fill({
         title: 'Test Item',
         content: 'test item content asd;lfhaslekutchbaweliuvtaywelivutabwyelvituybl'
      })
      .map((i, n) => {
         return { ...i, isCompleted: n < 4 };
      });
</script>

<head>
   <title>PP Timeline</title>
</head>

<div class="section">
   <div class="container">
      <div class="window has-shadow">
         <div class="content">
            <Timeline {steps} />
         </div>
      </div>
   </div>
</div>

<script>
	import { getContext, onMount } from 'svelte';
  
  export let mouseData;
  let line = true;
	const { register, unregister } = getContext('canvas');

  let lineData = [];
	
	onMount(() => {
		register(draw);
		
		return () => {
			unregister(draw);
		}
	})
	
	function draw(ctx) {
		ctx.beginPath();
    ctx.strokeStyle="#FFF";

    if(line && mouseData.onMouseDown){
      if(lineData.length == 0) {lineData = [{x: mouseData.cxM, y: mouseData.cyM}]}
      else{lineData.push({x: mouseData.cxM, y: mouseData.cyM})}
    }

    lineData.forEach(e => {
      ctx.lineTo(e.x, e.y);
    });
    ctx.stroke();
	}
</script>
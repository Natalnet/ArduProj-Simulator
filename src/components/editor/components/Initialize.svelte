<script>
	import { getContext, onMount } from 'svelte';
  
	const { register, unregister } = getContext('canvas');
	
	onMount(() => {
		register(draw);
		
		return () => {
			unregister(draw);
		}
	})
	
	function draw(ctx) {
		ctx.beginPath();
		ctx.fill();
	}
</script>
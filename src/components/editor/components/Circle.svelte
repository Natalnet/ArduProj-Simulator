<script>
	import { getContext, onMount } from 'svelte';
	
	export let r;
	export let cx;
	export let cy;
	export let fill;
	
	const { register, unregister } = getContext('canvas');
	
	onMount(() => {
		register(draw);
		
		return () => {
			unregister(draw);
		}
	})
	
	function draw(ctx) {
		ctx.beginPath();
		ctx.fillStyle = fill;
		ctx.arc(cx, cy, r, 0, 2*Math.PI, true);
		ctx.fill();
	}
</script>
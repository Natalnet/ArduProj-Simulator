<script>
	import { onMount, setContext } from 'svelte';
	let canvas;
	export let height;
	export let width, cxM, cyM;
  export let editorSize;
	
	const drawFunctions = [];
	
	setContext('canvas', {
		register(drawFn) {
			drawFunctions.push(drawFn);
		},
		unregister(drawFn) {
			drawFunctions.splice(drawFunctions.indexOf(drawFn), 1);
		}
	});
	
	onMount(() => {
		const ctx = canvas.getContext('2d');
		canvas.height = height;
		canvas.width = width;
		
		function update() {
			//
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.save();
			ctx.translate(canvas.width / 2, canvas.height / 2);
			drawFunctions.forEach(drawFn => {
				drawFn(ctx);
			});

			ctx.restore();
			
			frameId = requestAnimationFrame(update);
		}
		
		let frameId = requestAnimationFrame(update);
		
		return () => {
			cancelAnimationFrame(frameId);
		}
	});
	const handleMouseMove = e => { 
		let rect = e.target.getBoundingClientRect(); 
		cxM = e.clientX - rect.left - (editorSize.width/2);
		cyM = e.clientY - rect.top - (editorSize.height/2);
	};
</script>

<canvas on:mousemove={handleMouseMove} bind:this={canvas} style="border: 1px solid red" />

<slot />
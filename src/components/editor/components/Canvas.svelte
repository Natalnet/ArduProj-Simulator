<script>
	import { onMount, setContext } from 'svelte';
	let canvas;
	export let mouseData, editorSize, onMouseDown;
	
	const drawFunctions = [];

  function drawGrid(ctx, w, h,s) {
    let gridX = w / s;
    let gridY = h / s;
    ctx.strokeStyle = "#222"
    for (let i = 0; i < gridX; i++) {
      for (let j = 0; j < gridY; j++) {
        ctx.rect(i*s, j*s, s, s)
      }
    }
    ctx.stroke()
  }
	
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
		canvas.height = editorSize.height;
		canvas.width = editorSize.width;

		
		function update() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.save();
      
      drawGrid(ctx, canvas.width, canvas.height, 20);
      
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
		let rectDraw = e.target.getBoundingClientRect(); 
		mouseData.cxM = e.clientX - rectDraw.left - (editorSize.width/2);
		mouseData.cyM = e.clientY - rectDraw.top - (editorSize.height/2);
	};
</script>

<canvas 
	class:cursorDrag={mouseData.working}
	on:mousemove={handleMouseMove} 
	bind:this={canvas} 
	height={editorSize.height} 
	width={editorSize.width} 
	on:mousedown={ () => onMouseDown = true}
	on:mouseup={ () => {onMouseDown = false; mouseData.working = false}}
	on:dblclick={() =>  mouseData.onDblclick = true}
/>

<slot />
<style>
  canvas{
    border-radius: 10px;
  }
	.cursorDrag{ cursor: grabbing; }
</style>
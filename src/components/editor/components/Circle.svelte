<script>
  import { components } from '../../../lib/store';
	import { getContext, onMount } from 'svelte';
	
	export let data, mouseData;
  
	const { register, unregister } = getContext('canvas');
	
  const validatePosition = () => {
    return (
      !mouseData.working 
      && mouseData.onMouseDown 
      && (
        (
          (mouseData.cxM - data.cx)*(mouseData.cxM - data.cx) + 
          (mouseData.cyM - data.cy)*(mouseData.cyM - data.cy)
        )
        <= data.r*data.r
      )
    )
  };
  const updateStatus = ctx => {
    data.dragOn = true;
    mouseData.working = true;
    ctx.arc(data.cx, data.cy, data.r, 0, 2*Math.PI, true);
    data.cx = mouseData.cxM;
    data.cy = mouseData.cyM;
    
    let compAux = $components;
    compAux.splice(compAux.indexOf(data),1);
    compAux.push(data);
    components.set(compAux);
  }
	onMount(() => {
		register(draw);
		
		return () => {
			unregister(draw);
		}
	})
	
	function draw(ctx) {
		ctx.beginPath();
		ctx.fillStyle = data.fill;

    if(!mouseData.onMouseDown) data.dragOn = false;
    if(validatePosition() || data.dragOn){
      updateStatus(ctx);
    }else{
      ctx.arc(data.cx, data.cy, data.r, 0, 2*Math.PI, true);
    }
		ctx.fill();
	}
</script>
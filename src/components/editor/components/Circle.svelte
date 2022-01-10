<script>
  import { components } from '../../../lib/store';
	import { getContext, onMount } from 'svelte';
	
	export let data, mouseData, itemSelected;
  
	const { register, unregister } = getContext('canvas');
	
  const validatePositionDraggable = () => {
    return (
      !mouseData.working 
      && mouseData.onMouseDown 
      && validatePosition()
    )
  }
  const validatePosition = () => {
    return ((
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
    if(validatePositionDraggable() || data.dragOn){ updateStatus(ctx);}
    else{ ctx.arc(data.cx, data.cy, data.r, 0, 2*Math.PI, true); }

    if(validatePosition() || data == itemSelected){
      ctx.font = "16px serif";
      ctx.textAlign = "center";
      document.body.style.cursor = "pointer";
      ctx.fillText(data.name, data.cx, data.cy + data.r*1.5, data.r*5)
    }else{document.body.style.cursor = "auto"; }
      
    if(mouseData.onDblclick || itemSelected == data){ itemSelected = $components[$components.length - 1]; mouseData.onDblclick = false; }
    
    ctx.stroke();
		ctx.fill();
	}
</script>
<script>
  import { components, menuComponents } from '../lib/store';
  import Canvas from './editor/components/Canvas.svelte';
  import Circle from './editor/components/Circle.svelte';
  import Line from './editor/components/Line.svelte';
  import ToolBar from './editor/components/ToolBar.svelte';
  import MenuForItem from './editor/components/MenuForItem.svelte';
  import Initialize from './editor/components/Initialize.svelte';

  let mouseData = {cxM: 0, cyM: 0, onMouseDown: false, working: false, onDblclick: false}
  let editorOffsetHeight, editorOffsetWidth, editor;
  let itemSelected;

  const handleDragDrop = e => {
    let name = e
        .dataTransfer
        .getData("text");
    let element = JSON.parse(JSON.stringify($menuComponents.filter(el => el.name == name)[0]));
    components.set([...$components, element]);
  }

</script>
<div id="editor" 
  bind:this={editor} 
  bind:clientWidth={editorOffsetWidth} 
  bind:clientHeight={editorOffsetHeight}

	on:drop|preventDefault={handleDragDrop}
	ondragover="return false"
>
<ToolBar/>
<div class="canvas">
  {#if editor}
    <Canvas
      height={editorOffsetHeight} 
      width={editorOffsetWidth}  
      bind:onMouseDown={mouseData.onMouseDown}
      bind:mouseData={mouseData}
      editorSize={{height: editorOffsetHeight, width: editorOffsetWidth}}
    >
      <Initialize {mouseData}/>
      <!-- <Line {mouseData}/> -->
      {#each $components as component}
        <Circle bind:data={component} {mouseData} bind:itemSelected={itemSelected}/>
      {/each}
    </Canvas>
  {/if}
</div>
  <p class="mouse-position">x: {mouseData.cxM.toFixed(1)} y: {mouseData.cyM.toFixed(1)}</p>
  <MenuForItem bind:itemSelected={itemSelected}/>
</div>

<style>
  #editor {
    margin: 0 10px 5px 10px;
    flex: 1;
    height: calc(100vh - 100px);
    position: relative;
    overflow: hidden;
    border-radius: 10px;
  }
  .canvas{
    background-color: hsl(0, 0%, 10%);
    border-radius: 10px;
  }
  .mouse-position{
    position: absolute;
    bottom: 0;
    right: 10px;
    color: #f1f1f1
  }
</style>
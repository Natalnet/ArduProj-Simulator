<script>
  import { components, menuComponents } from '../lib/store';
  import Canvas from './editor/components/Canvas.svelte';
  import Circle from './editor/components/Circle.svelte';
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
  {#if editor}
    <Canvas
      height={editorOffsetHeight} 
      width={editorOffsetWidth}  
      bind:onMouseDown={mouseData.onMouseDown}
      bind:mouseData={mouseData}
      editorSize={{height: editorOffsetHeight, width: editorOffsetWidth}}
    >
      <Initialize/>
      {#each $components as component}
        <Circle bind:data={component} {mouseData} bind:itemSelected={itemSelected}/>
      {/each}
  </Canvas>
{/if}
  <p class="mouse-position">x: {mouseData.cxM} y: {mouseData.cyM}</p>
  <MenuForItem bind:itemSelected={itemSelected}/>
</div>

<style>
  #editor {
    background-color: hsl(0, 0%, 10%);
    margin: 0 10px 5px 10px;
    border-radius: 10px;
    flex: 1;
    height: calc(100vh - 100px);
    position: relative;
    overflow: hidden;
  }
  .mouse-position{
    position: absolute;
    bottom: 0;
    right: 10px;
    color: #f1f1f1
  }
</style>
<script>
import Canvas from './editor/components/Canvas.svelte';
import Circle from './editor/components/Circle.svelte';
let cxM = 0, cyM = 0;

let editor;
</script>

<div id="editor" bind:this={editor}>
  {#if editor}
    <Canvas height={editor.offsetHeight} width={editor.offsetWidth}  bind:cxM={cxM} bind:cyM={cyM} editorSize={{height: editor.offsetHeight, width: editor.offsetWidth}}>
      <Circle 
        r="30"
        cx={cxM}
        cy={cyM}
        fill={0}
        
      />
  </Canvas>
{/if}
</div>

<style>
  #editor {
    background-color: hsl(0, 0%, 10%);
    margin: 0 10px 5px 10px;
    border-radius: 10px;
    flex: 1;
    height: calc(100vh - 100px);
  }
</style>
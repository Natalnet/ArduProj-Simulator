<script>
  import Canvas from '../components/editor/Canvas.svelte';
</script>
<div id="editor">
  <Canvas/>
</div>

<style>
  #editor {
    /* background-color: hsl(0, 0%, 10%); */
    margin: 0 10px 5px 10px;
    border-radius: 10px;
    flex: 1;
    height: calc(100vh - 100px);
  }
</style>
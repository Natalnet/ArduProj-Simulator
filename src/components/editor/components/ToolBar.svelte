<script>
  import tools from '../../../lib/tools.js';
</script>

<div class="toolbar">
  {#each tools as tool}
    <div class="tool" title="{tool.name}">
      <i class="{tool.icon}"></i>
    </div>
  {/each}
</div>

<style>
  .toolbar{
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 10px 0;
    padding: 3px 10px;
    background-color: #d1d1d1;
    border-radius: 50px;
  }
  .tool{
    width: 40px;
    height: 100%;
    border-radius: 20px;
    align-items: center;
    display: flex;
    justify-content: center;
    background-color: rgb(177, 177, 177);
    margin: 5px 0;
    cursor: pointer;
  }
</style>
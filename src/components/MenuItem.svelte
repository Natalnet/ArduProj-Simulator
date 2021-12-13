<script>
  export let component;

  const handleDragStart = e => {
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.setData("text", e.target.getAttribute('name'));
  }
</script>

<div
  name={component.name}
  style='background-color:{component.fill}'
  class="item col" 
  draggable=true
  on:dragstart={handleDragStart}
  >
  {component.name}
</div>
<style>
  .item{
    border-radius: 5px;
    cursor: pointer;
    user-select: none;
    margin: 5px 10px;
  }
</style>
<script>
  import { fly } from 'svelte/transition';
  import { components } from '../../../lib/store';
  export let itemSelected;

  const destroyItem = () => {
    components.set($components.filter(item => item !== itemSelected));
    itemSelected = undefined;
  }
</script>

{#if itemSelected}
  <div class="card text-dark bg-light mb-3 edition-item" in:fly="{{ x: 200, duration: 200 }}" out:fly="{{ x: 200, duration: 200 }}">
    <div class="card-header">
      <span>{itemSelected.name}</span>
      <span class="close" on:click={() =>{ itemSelected = undefined}}>&#x2715</span>
    </div>
    <div class="card-body">
      {#each itemSelected.editableAttributes as attr}
        <div class="input-container">
          <label for={attr.key} class="label-el form-label" data-name={name = attr.name}>{attr.name}</label>
          <input type="text" name={attr.key} id={attr.key} bind:value={itemSelected[attr.key]} class="input-el form-control">
        </div>
      {/each}
    </div>
    <div class="actions">
      <button class="btn btn-primary" on:click={() =>{ itemSelected = undefined}}>Confirmar</button>
      <button class="deletar-item btn btn-danger" on:click={destroyItem}>Excluir</button>
    </div>
  </div>
{/if}

<style>
.card{
  max-width: 18rem;
}
.label-el{
  font-size: 14px;
    color: #777;
    margin-bottom: 0px;
}
.input-container{
  margin-bottom: 5px;
}
.actions{
  width: 100%;
  padding: 0 5px;
  margin-bottom: 5px;
  display:flex;
  align-items: center;
  justify-content: flex-end;
}
.actions button{
  margin-left: 10px;
}
.edition-item{
  width: 300px;
  max-height: 80%;
  position: absolute;
  right: 5px;
  top: 5px;
  background-color: red;
  border-radius: 10px;
  color: white
}
.card-header{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.card-body{
  overflow-y: auto;
  margin: 10px 0;
  padding: 0 10px
}
.close{
  cursor: pointer;
}
.close:hover{
  color: red;
}
</style>
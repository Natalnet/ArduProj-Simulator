<script>
  export let sidebar;
  $: console.log(sidebar);
</script>
<header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
  <a href="/" class="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
    <i class="menu fas fa-bars" class:show={sidebar} on:click={() => sidebar = !sidebar}></i>
  </a>

  <a href="/" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
    <strong class="name text-black">Ernane</strong>
    <img src="https://www.petz.com.br/blog/wp-content/uploads/2021/03/piercing-para-cachorro-2.jpg" alt="" width="32" height="32" class="rounded-circle me-2">
  </a>
</header>

<style>
  header{ padding: 0 20px;} 
  .menu{ font-size: 35px; opacity: 0; transition: .3s all ease; transform: translateX(-30px);}
  .show{opacity: 1; transform: none;}
  .name{margin-right: 10px;}
</style>
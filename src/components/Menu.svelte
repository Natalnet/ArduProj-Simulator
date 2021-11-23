<script>
  export let closeSidebar = false;
</script>
<div class:closeSidebar={closeSidebar} class="sidebar d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style="width: 280px;">
  <a href="/" class="header-navbar d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
    <span>
      <i class="fas fa-tools"></i>
      <span class="fs-4">Logo?</span>
    </span>
    <i class="fas fa-times close-sidebar" on:click={() => closeSidebar = !closeSidebar}></i>
  </a>
  <hr>
  <ul class="nav nav-pills flex-column mb-auto">
    <li class="nav-item" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
      <a href="/" class="nav-link active" aria-current="page">
        <span>
          <i class="fas fa-sitemap"></i>
          Componentes
        </span>
        <i class="fas fa-angle-down"></i>
      </a>
    </li>
    <div class="collapse" id="collapseExample">
      <div class="card card-body">
        Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the relevant trigger.
      </div>
    </div>
  </ul>
  <hr>
  <div class="dropdown">
    <a href="/" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
      <img src="https://www.petz.com.br/blog/wp-content/uploads/2021/03/piercing-para-cachorro-2.jpg" alt="" width="32" height="32" class="rounded-circle me-2">
      <strong>Ernane</strong>
    </a>
    <ul class="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
      <li><a class="dropdown-item" href="/">Novo Projeto</a></li>
      <li><a class="dropdown-item" href="/">Configuracoes</a></li>
      <li><a class="dropdown-item" href="/">Perfil</a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" href="/">Sair</a></li>
    </ul>
  </div>
</div>

<style>
  .sidebar{ height: 100vh; }
  i.fas{ margin-right: 10px; }
  .nav-link{margin: 10px 0;}
  .sidebar{transition: all ease .3s;}
  .close-sidebar{ padding: 10px 0 10px 10px; cursor: pointer;}
  .closeSidebar{margin-left: -280px;}
  .nav-link, .header-navbar{display:flex !important; width: 100%; align-items:center; justify-content:space-between;}
</style>
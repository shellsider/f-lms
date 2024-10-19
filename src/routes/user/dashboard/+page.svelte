<script>
 import NavBarUserPage from "../../../Sections/UserPageSections/NavBarUserPage.svelte";
  </script>
  
  <main class="min-h-screen flex flex-col overflow-hidden">
    <section id="nav-section">
        <NavBarUserPage />
    </section>
  
    <section id="form-section" class="flex-grow flex justify-center items-center">
        
    </section>
  </main>
  
  <style>
    /* Make sure the body doesn't scroll */
    :global(body) {
        overflow: hidden;
        background-color: #1D3247;
    }
  </style>
  
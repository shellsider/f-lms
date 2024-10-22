<script>
  
  import AdminHomePageNavbar from "../../../Sections/AdminLoginPageSections/NavBarAdminPage.svelte"
  import AdminSignInForm from "../../../Sections/AdminLoginPageSections/AdminSignInForm.svelte";
</script>

<main class="min-h-screen flex flex-col overflow-hidden">
  <section id="nav-section">
      <AdminHomePageNavbar />
  </section>

  <section id="form-section" class="flex-grow flex justify-center items-center">
      <AdminSignInForm />
  </section>
</main>

<style>
  /* Make sure the body doesn't scroll */
  :global(body) {
      overflow: hidden;
      background-color: #1D3247;
  }
</style>

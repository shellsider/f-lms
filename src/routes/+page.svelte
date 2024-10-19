<script>
  import HomePageNavbar from "../Components/HomePageNavbar/HomePageNavbar.svelte";
  import SignInForm from "../Sections/HomePageSections/SignInForm.svelte";
</script>

<main class="min-h-screen flex flex-col overflow-hidden">
  <section id="nav-section">
      <HomePageNavbar />
  </section>

  <section id="form-section" class="flex-grow flex justify-center items-center">
      <SignInForm />
  </section>
</main>

<style>
  /* Make sure the body doesn't scroll */
  :global(body) {
      overflow: hidden;
      background-color: #1D3247;
  }
</style>

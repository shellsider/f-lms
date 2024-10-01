<script>
    import HomePageNavbar from "../Components/HomePageNavbar/HomePageNavbar.svelte";
    import HomePageSignInForm from "../Components/HomePageSignInForm/HomePageSignInForm.svelte";
</script>

<main class="min-h-screen flex flex-col">
    <section id="nav-section">
        <HomePageNavbar />
    </section>

    <section id="form-section" class="flex-grow   justify-center">
        <HomePageSignInForm />
    </section>
</main>

<style>
  #form-section {
    margin-top: 100px; /* Adjust this to move the form slightly up */
  }
</style>

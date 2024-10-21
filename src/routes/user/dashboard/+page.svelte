<!-- src/routes/user/dashboard/+page.svelte -->

<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import {
    isAuthenticated,
    persistor,
  } from '../../../store/authStore.js';
  import NavBarUserPage from "../../../Sections/UserPageSections/NavBarUserPage.svelte";

  let rehydrated = false;

  onMount(() => {
    if (typeof window !== 'undefined') {
      persistor.persist();

      if (persistor.getState().bootstrapped) {
        rehydrated = true;
        checkAuth();
      } else {
        const unsubscribe = persistor.subscribe(() => {
          if (persistor.getState().bootstrapped) {
            rehydrated = true;
            unsubscribe();
            checkAuth();
          }
        });
      }
    } else {
      rehydrated = true;
    }
  });

  function checkAuth() {
    if (!$isAuthenticated) {
      goto('/');
    }
  }
</script>

{#if rehydrated && $isAuthenticated}
  <main class="min-h-screen flex flex-col overflow-hidden">
    <section id="nav-section">
      <NavBarUserPage />
    </section>

    <section id="form-section" class="flex-grow flex justify-center items-center">
      <!-- Your dashboard content -->
      <h1 class="text-white text-2xl">Welcome to your dashboard!</h1>
    </section>
  </main>
{:else if rehydrated}
  <!-- If rehydrated but not authenticated, redirecting -->
  <div>Redirecting to login...</div>
{:else}
  <!-- Loading indicator during rehydration -->
  <div>Loading...</div>
{/if}

<style>
  /* Make sure the body doesn't scroll */
  :global(body) {
    overflow: hidden;
    background-color: #1D3247;
  }
</style>

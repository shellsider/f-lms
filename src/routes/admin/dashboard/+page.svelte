<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import {
      isAuthenticated,
      persistor,
    } from '../../../store/authStore.js';
    import NavBarAdminPage from "../../../Sections/AdminPageSections/AdminNavbar.svelte";
  
    let rehydrated = false;
    let pendingLeaves = 10; // Sample data for Pending Leaves
    let usersOnLeave = 10;  // Sample data for Users on Leave

    // Sample table data
    let usersOnLeaveToday = [
      { fullname: 'ABCD Singh', upto: '20-10-2024' },
      // Add more users as needed
    ];
  
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

    function viewLeaveDetails(user) {
      // Navigate to leaveDetail page, passing some query parameters if needed
      goto(`/admin/leaveDetail?fullname=${user.fullname}&upto=${user.upto}`);
    }
</script>

{#if rehydrated && $isAuthenticated}
  <main class="min-h-screen flex flex-col overflow-hidden">
    <section id="nav-section">
      <NavBarAdminPage />
    </section>

    <!-- Dashboard Content -->
    <section id="form-section" class="flex-grow flex justify-center items-center">
      <div class="container mx-auto p-6 text-white">
        <!-- Top Info Boxes -->
        <div class="flex justify-center space-x-10 mb-8">
            <a href="/admin/pendingLeaves" class="no-underline">
                <div class="box flex flex-col items-center justify-center cursor-pointer">
                  <h2 class="text-lg">Pending Leaves</h2>
                  <p class="text-2xl font-semibold">{pendingLeaves}</p>
                </div>
              </a>

          <div class="box flex flex-col items-center justify-center">
            <h2 class="text-lg">Users on Leave</h2>
            <p class="text-2xl font-semibold">{usersOnLeave}</p>
          </div>
        </div>

        <!-- Table Section -->
        <div>
          <h2 class="text-center text-xl mb-4">Users on Leave Today</h2>
          <table class="table-auto w-full text-center border-collapse border border-gray-500">
            <thead>
              <tr class="bg-[#462257] text-white">
                <th class="border border-gray-500 py-2">S.no</th>
                <th class="border border-gray-500 py-2">Fullname</th>
                <th class="border border-gray-500 py-2">Upto</th>
                <th class="border border-gray-500 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {#each usersOnLeaveToday as user, index}
                <tr class="bg-[#6A427F] text-white">
                  <td class="border border-gray-500 py-2">{index + 1}</td>
                  <td class="border border-gray-500 py-2">{user.fullname}</td>
                  <td class="border border-gray-500 py-2">{user.upto}</td>
                  <td class="border border-gray-500 py-2">
                    <button
                      class="bg-[#1D3247] text-white px-4 py-1 rounded hover:bg-[#3C5175]"
                      on:click={() => viewLeaveDetails(user)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
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
  .container {
    max-width: 1200px;
  }

  .box {
    background-color: #330D52; /* Dark purple background */
    padding: 20px;
    border-radius: 10px;
    width: 180px;
    height: 100px;
  }

  table {
    background-color: #3C5175; /* Light purple background */
  }

  /* Make sure the body doesn't scroll */
  :global(body) {
    overflow: hidden;
    background-color: #1D3247;
  }
</style>

<script>
  import { onMount } from 'svelte';
  import logoUrl from '$lib/HomePageAssets/logo.png';
  import { fly } from 'svelte/transition';
import { goto } from '$app/navigation';
  let textLg = 'Guru Tegh Bahadur Institute of Technology';
  let userInitials = 'GS'; // Placeholder for user initials
  let showDropdown = false;

  const toggleDropdown = (event) => {
      event.stopPropagation(); // Prevent this click from triggering the outside click listener
      if(showDropdown){
          console.log(`1 Show Dropdown: ${showDropdown}`)
          showDropdown = false
      } else {
          console.log(`2 Show Dropdown: ${showDropdown}`)
          showDropdown = true
      }
  };

  const handleEdit = () => {
      console.log("Edit clicked");
      showDropdown = false; // Close dropdown after action
  };

  const handleLogout = () => {
      console.log("Logout clicked");
      showDropdown = false; // Close dropdown after action
  };

  const closeDropdownOnClickOutside = () => {
      showDropdown = false;
  };

  // Attach event listener to close dropdown when clicking outside
  onMount(() => {
      document.addEventListener('click', closeDropdownOnClickOutside);

      // Clean up the event listener on component unmount
      return () => {
          document.removeEventListener('click', closeDropdownOnClickOutside);
      };
  });
</script>

<div class="flex items-center justify-between p-4 shadow-md h-16 bg-[#2A194C] relative">
  <!-- Left side: Logo and Title -->
  <div class="flex items-center space-x-2">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <img src={logoUrl} alt="Logo" class="h-12 w-12" on:click={() => {goto('/admin/dashboard')}}/>
      <h1 class="ml-2 text-lg text-white font-semibold hidden sm:block">
          Leave Portal
      </h1>
  </div>

  <!-- Right side: Navigation Links and User Initials -->
  <div class="flex items-center space-x-6 ml-auto">
      <a href="#" class="text-white text-base font-medium hover:text-[#ffc4d1] transition duration-200">
          Pending Leaves
      </a>
      <a href="#" class="text-white text-base font-medium hover:text-[#ffc4d1] transition duration-200">
          Leave History
      </a>
      <a href="#" class="text-white text-base font-medium hover:text-[#ffc4d1] transition duration-200">
        Manage User
    </a>
      <!-- User Initials Placeholder with Dropdown Trigger -->
      <div class="relative dropdown-container">
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div 
              class="flex items-center justify-center w-8 h-8 z-50 bg-gray-500 text-white font-bold rounded-full cursor-pointer hover:bg-[#330d52] transition duration-300"
              on:click={toggleDropdown}
          >
              {userInitials}
          </div>
          <!-- Dropdown Menu -->
          {#if showDropdown}
              <div 
                  class="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg text-gray-800 overflow-hidden"
                  transition:fly={{ y: -5, duration: 200 }}
              >
                  <a 
                      href="#" 
                      class="block px-4 py-2 text-sm hover:bg-gray-200 transition duration-200"
                      on:click={handleEdit}
                  >
                      Edit
                  </a>
                  <a 
                      href="#" 
                      class="block px-4 py-2 text-sm hover:bg-gray-200 transition duration-200"
                      on:click={handleLogout}
                  >
                      Logout
                  </a>
              </div>
          {/if}
      </div>
  </div>
</div>

<style>
  :global(body) {
      background-color: #1D3247;
      overflow: hidden;
  }
</style>

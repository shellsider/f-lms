<script>
	import { onMount } from 'svelte';
	import logoUrl from '$lib/HomePageAssets/logo.png';
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';

	let textLg = 'Guru Tegh Bahadur Institute of Technology';
	let userInitials = 'GS'; // Placeholder for user initials
	let showUserDropdown = false;
	let showNavDropdown = false;

	const toggleUserDropdown = (event) => {
		event.stopPropagation(); // Prevent this click from triggering the outside click listener
		showUserDropdown = !showUserDropdown;
	};

	const toggleNavDropdown = (event) => {
		event.stopPropagation();
		showNavDropdown = !showNavDropdown;
	};

	const handleEdit = () => {
		console.log('Edit clicked');
		showUserDropdown = false; // Close dropdown after action
	};

	const handleLogout = () => {
		console.log('Logout clicked');
		showUserDropdown = false; // Close dropdown after action
	};

	const closeDropdownsOnClickOutside = () => {
		showUserDropdown = false;
		showNavDropdown = false;
	};

	// Attach event listener to close dropdowns when clicking outside
	onMount(() => {
		document.addEventListener('click', closeDropdownsOnClickOutside);

		// Clean up the event listener on component unmount
		return () => {
			document.removeEventListener('click', closeDropdownsOnClickOutside);
		};
	});
</script>

<div class="relative flex h-16 items-center justify-between bg-[#2A194C] p-4 shadow-md">
	<!-- Left side: Logo and Title -->
	<div class="flex items-center space-x-2">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<img
			src={logoUrl}
			alt="Logo"
			class="h-12 w-12 cursor-pointer"
			on:click={() => {
				goto('/admin/dashboard');
			}}
		/>
		<h1 class="ml-2 hidden text-lg font-semibold text-white sm:block">Leave Portal</h1>
	</div>

	<!-- Right side: Navigation Links and User Initials -->
	<div class="ml-auto flex items-center space-x-4">
		<!-- Hamburger Menu Icon for Mobile -->
		<div class="sm:hidden">
			<button class="text-white focus:outline-none" on:click={toggleNavDropdown}>
				<!-- Hamburger Icon -->
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>
		</div>

		<!-- Navigation Links (hidden on mobile) -->
		<div class="hidden items-center space-x-6 sm:flex">
			<a
				href="pendingLeaves"
				class="text-base font-medium text-white transition duration-200 hover:text-[#ffc4d1]"
			>
				Pending Leaves
			</a>
			<a
				href="leaveHistory"
				class="text-base font-medium text-white transition duration-200 hover:text-[#ffc4d1]"
			>
				Leave History
			</a>
			<a
				href="manageUser"
				class="text-base font-medium text-white transition duration-200 hover:text-[#ffc4d1]"
			>
				Manage User
			</a>
		</div>

		<!-- User Icon and Dropdown -->
		<div class="dropdown-container relative flex items-center">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<!-- User Initials Placeholder with Dropdown Trigger -->
			<div
				class="z-50 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-500 font-bold text-white transition duration-300 hover:bg-[#330d52]"
				on:click={toggleUserDropdown}
			>
				{userInitials}
			</div>
			<!-- Dropdown Menu -->
			{#if showUserDropdown}
				<div
					class="absolute right-0 mt-2 w-32 overflow-hidden rounded-md bg-white text-gray-800 shadow-lg"
					transition:fly={{ y: -5, duration: 200 }}
				>
					<a
						href="#"
						class="block px-4 py-2 text-sm transition duration-200 hover:bg-gray-200"
						on:click={handleEdit}
					>
						Edit
					</a>
					<a
						href="#"
						class="block px-4 py-2 text-sm transition duration-200 hover:bg-gray-200"
						on:click={handleLogout}
					>
						Logout
					</a>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Mobile Navigation Dropdown -->
{#if showNavDropdown}
	<div class="sm:hidden">
		<div class="space-y-2 bg-[#2A194C] px-4 py-2 text-white">
			<a
				href="pendingLeaves"
				class="block text-base font-medium transition duration-200 hover:text-[#ffc4d1]"
			>
				Pending Leaves
			</a>
			<a
				href="leaveHistory"
				class="block text-base font-medium transition duration-200 hover:text-[#ffc4d1]"
			>
				Leave History
			</a>
			<a
				href="manageUser"
				class="block text-base font-medium transition duration-200 hover:text-[#ffc4d1]"
			>
				Manage User
			</a>
		</div>
	</div>
{/if}

<style>
	:global(body) {
		background-color: #1d3247;
		overflow: hidden;
	}
</style>

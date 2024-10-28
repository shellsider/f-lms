<script>
	import { onMount } from 'svelte';
	import logoUrl from '$lib/HomePageAssets/logo.png';
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { isAuthenticated, idToken, persistor } from '../../store/authStore.js';

	let textLg = 'Guru Tegh Bahadur Institute of Technology';
	let userInitials = 'GS'; // Placeholder for user initials
	let showDropdown = false;

	const toggleDropdown = (event) => {
		event.stopPropagation();
		showDropdown = !showDropdown;
	};

	const handleEdit = () => {
		console.log('Edit clicked');
		showDropdown = false;
	};

	const handleLogout = () => {
		console.log('Logout clicked');
		showDropdown = false;

		// Clear local storage
		localStorage.clear();

		// Purge persisted store (if using redux-persist or similar)
		if (persistor && persistor.purge) {
			persistor.purge();
		}

		// Reset Svelte stores
		isAuthenticated.set(false);
		idToken.set(null);

		// Reload the page to trigger redirection
		goto('/');
		window.location.reload();
	};

	const closeDropdownOnClickOutside = () => {
		showDropdown = false;
	};

	onMount(() => {
		document.addEventListener('click', closeDropdownOnClickOutside);

		return () => {
			document.removeEventListener('click', closeDropdownOnClickOutside);
		};
	});
</script>

<div class="relative flex h-16 items-center justify-between bg-[#2A194C] p-4 shadow-md">
	<!-- Left side: Logo and Title -->
	<div class="flex items-center space-x-2">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<img src={logoUrl} alt="Logo" class="h-12 w-12" />
		<h1 class="ml-2 hidden text-lg font-semibold text-white sm:block">Leave Portal</h1>
	</div>

	<!-- Right side: Navigation Links and User Initials -->
	<div class="ml-auto flex items-center space-x-6">
		<a
			href="/user/dashboard"
			class="text-base font-medium text-white transition duration-200 hover:text-[#ffc4d1]"
		>
			Apply Leave
		</a>
		<a
			href="/user/leaveHistory"
			class="text-base font-medium text-white transition duration-200 hover:text-[#ffc4d1]"
		>
			Leave History
		</a>
		<!-- User Initials Placeholder with Dropdown Trigger -->
		<div class="dropdown-container relative">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="z-50 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-500 font-bold text-white transition duration-300 hover:bg-[#330d52]"
				on:click={toggleDropdown}
			>
				{userInitials}
			</div>
			<!-- Dropdown Menu -->
			{#if showDropdown}
				<div
					class="absolute right-0 mt-2 w-32 overflow-hidden rounded-md bg-white text-gray-800 shadow-lg"
					transition:fly={{ y: -5, duration: 200 }}
				>
					<a
						href="/user/dashboard"
						class="block px-4 py-2 text-sm transition duration-200 hover:bg-gray-200"
						on:click={handleEdit}
					>
						Edit
					</a>
					<button
						class="block px-4 py-2 text-sm transition duration-200 hover:bg-gray-200"
						on:click={handleLogout}
					>
						Logout
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	:global(body) {
		background-color: #1d3247;
		overflow: hidden;
	}
</style>

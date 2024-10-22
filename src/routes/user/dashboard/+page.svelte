<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isAuthenticated, persistor } from '../../../store/authStore.js';
	import NavBarUserPage from '../../../Sections/UserPageSections/NavBarUserPage.svelte';
	import ApplyLeaveForm from '../../../Sections/UserPageSections/ApplyLeaveForm.svelte';

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
	<main class="flex min-h-screen flex-col">
		<section id="nav-section">
			<NavBarUserPage />
		</section>

		<section id="form-section" class="flex flex-grow items-center justify-center">
			<ApplyLeaveForm />
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
	/* Allow the body to scroll */
	:global(body) {
		background-color: #1d3247;
		overflow-y: auto;
	}

	main {
		/* Ensure that the main container is scrollable when content exceeds the viewport */
		flex: 1;
		overflow-y: auto;
	}
</style>

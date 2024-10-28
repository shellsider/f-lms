<script>
	import { createEventDispatcher } from 'svelte';
	export let userEmail = '';
	export let loading = false;
	let showMessage = false;
	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}

	async function confirmDelete() {
		dispatch('confirmDelete', { email: userEmail });
		showMessage = true;
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
	<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
		{#if showMessage}
			<div class="text-center">
				<p>Successfully deleted user!</p>
			</div>
		{:else}
			<h2 class="mb-4 text-center text-xl font-semibold text-gray-800">
				Are you sure you want to delete this user?
			</h2>
			<p class="mb-4 text-center text-gray-600">Email: {userEmail}</p>

			<div class="mt-4 flex justify-around">
				<button
					class="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
					on:click={confirmDelete}
					disabled={loading}
				>
					{#if loading}
						<span class="loader"></span>
					{:else}
						Yes
					{/if}
				</button>
				<button
					class="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
					on:click={closeModal}
				>
					Cancel
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	/* Spinner styling */
	.loader {
		border: 4px solid #f3f3f3;
		border-top: 4px solid #3498db;
		border-radius: 50%;
		width: 1rem;
		height: 1rem;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>

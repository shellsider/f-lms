<script>
	import { createEventDispatcher } from 'svelte';
	import axios from 'axios';
	import { idToken } from '../../store/authStore.js';

	const dispatch = createEventDispatcher();

	// Form fields
	let email = '';
	let password = '';
	let username = '';
	let firstname = '';
	let lastname = '';
	let emp_type = 'regular';
	let dept = 'IT';
	let role = 'user';

	let errorMessage = '';
	let successMessage = '';

	// Close the modal
	function closeModal() {
		dispatch('close');
	}

	// Submit form data to the add user API
	async function submitForm() {
		try {
			const currentIdToken = $idToken;
			if (!currentIdToken) {
				errorMessage = 'No idToken available';
				return;
			}

			const formData = new URLSearchParams();
			formData.append('email', email);
			formData.append('password', password);
			formData.append('username', username);
			formData.append('firstname', firstname);
			formData.append('lastname', lastname);
			formData.append('emp_type', emp_type);
			formData.append('dept', dept);
			formData.append('role', role);

			const response = await axios.post('http://localhost:8000/admin/addUser', formData, {
				headers: {
					Authorization: `Bearer ${currentIdToken}`,
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});

			successMessage = response.data.message;
			errorMessage = '';

			// Emit an event to refresh the user list after successful addition
			dispatch('addUser');
			closeModal();
		} catch (error) {
			successMessage = '';
			errorMessage = error.response?.data?.detail || 'Error adding user.';
		}
	}
</script>

<div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
	<div class="w-full max-w-md rounded-lg bg-white p-6">
		<h2 class="mb-4 text-xl font-bold">Add New User</h2>
		{#if errorMessage}
			<div class="mb-2 text-red-500">{errorMessage}</div>
		{/if}
		{#if successMessage}
			<div class="mb-2 text-green-500">{successMessage}</div>
		{/if}

		<form on:submit|preventDefault={submitForm}>
			<label>Email:</label>
			<input type="email" bind:value={email} required class="mb-2 w-full rounded border p-2" />

			<label>Password:</label>
			<input type="input" bind:value={password} required class="mb-2 w-full rounded border p-2" />

			<label>Username:</label>
			<input type="text" bind:value={username} required class="mb-2 w-full rounded border p-2" />

			<label>First Name:</label>
			<input type="text" bind:value={firstname} required class="mb-2 w-full rounded border p-2" />

			<label>Last Name:</label>
			<input type="text" bind:value={lastname} required class="mb-2 w-full rounded border p-2" />

			<label>Employee Type:</label>
			<input type="text" bind:value={emp_type} class="mb-2 w-full rounded border p-2" />

			<label>Department:</label>
			<input type="text" bind:value={dept} class="mb-2 w-full rounded border p-2" />

			<button type="submit" class="mt-4 w-full rounded bg-blue-500 p-2 text-white">
				Add User
			</button>
			<button
				type="button"
				class="mt-2 w-full rounded bg-gray-500 p-2 text-white"
				on:click={closeModal}
			>
				Cancel
			</button>
		</form>
	</div>
</div>

<style>
	/* Additional styling for modal backdrop */
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
	}
</style>

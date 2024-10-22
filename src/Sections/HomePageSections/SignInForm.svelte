<!-- SignInForm.svelte -->

<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import axios from 'axios';
	import { store, setAuth, isAuthenticated, persistor } from '../../store/authStore.js';

	let email = '';
	let password = '';
	let errorMessage = '';
	let rehydrated = false;

	// Handle rehydration in onMount
	onMount(() => {
		if (typeof window !== 'undefined') {
			persistor.persist();

			if (persistor.getState().bootstrapped) {
				rehydrated = true;
			} else {
				const unsubscribe = persistor.subscribe(() => {
					if (persistor.getState().bootstrapped) {
						rehydrated = true;
						unsubscribe();
					}
				});
			}
		} else {
			rehydrated = true;
		}
	});

	// Handle login form submission
	async function handleLogin() {
		try {
			const formData = new URLSearchParams();
			formData.append('email', email);
			formData.append('password', password);

			const response = await axios.post('http://localhost:8000/signin', formData, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});

			if (response.status === 200) {
				const { idToken, refreshToken, expiresIn, username } = response.data;

				// Dispatch the setAuth action to update the store
				store.dispatch(setAuth({ idToken, refreshToken, expiresIn, username }));

				// Redirect to the dashboard
				goto('/user/dashboard');
			} else {
				errorMessage = response.data.detail || 'An error occurred during login.';
			}
		} catch (error) {
			console.error('Error during login:', error);
			if (error.response && error.response.data && error.response.data.detail) {
				errorMessage = error.response.data.detail;
			} else {
				errorMessage = 'An error occurred during login.';
			}
		}
	}
</script>

{#if rehydrated}
	<!-- Render the form only after rehydration -->
	<div class="flex min-h-screen items-center justify-center">
		<!-- Main container for the login form -->
		<div class="-mt-[100px] w-[500px] max-w-lg rounded-lg bg-[#2a194c] p-8 shadow-lg max-md:w-full">
			<h2 class="mb-8 text-center text-3xl font-semibold text-gray-300">Welcome</h2>

			<form class="space-y-6" on:submit|preventDefault={handleLogin}>
				<!-- Email Field -->
				<div>
					<label class="mb-1 block text-sm font-semibold text-gray-300" for="email"> Email </label>
					<input
						id="email"
						type="email"
						bind:value={email}
						class="w-full rounded-md bg-gray-800 px-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ffc4d1]"
						placeholder="Example@gmail.com"
						required
					/>
				</div>

				<!-- Password Field -->
				<div>
					<label class="mb-1 block text-sm font-semibold text-gray-300" for="password">
						Password
					</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						class="w-full rounded-md bg-gray-800 px-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ffc4d1]"
						placeholder="Password"
						required
					/>
				</div>

				<!-- Login Button -->
				<div>
					<button
						type="submit"
						class="w-full rounded-lg bg-gradient-to-r from-[#330d52] via-[#7a4abf] to-[#ffc4d1] py-3 font-bold text-gray-200 shadow-lg transition duration-300 hover:opacity-90"
					>
						Login
					</button>
				</div>
			</form>

			<!-- Error Message -->
			{#if errorMessage}
				<div class="mt-4 text-center text-red-500">
					{errorMessage}
				</div>
			{/if}

      <!-- Additional Links -->
      <div class="mt-4 text-center text-gray-400 text-sm">
        <a href="#" class="hover:underline" on:click="{() => goto('/admin/login')}">Admin Login</a> |
        <a href="#" class="hover:underline">Forgot password?</a> |
        <a href="#" class="hover:underline">Need Help?</a>
      </div>
    </div>
  </div>
{:else}
	<!-- Show a loading indicator while rehydrating -->
	<div>Loading...</div>
{/if}

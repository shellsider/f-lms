<script>
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { goto } from '$app/navigation';
	import { isAuthenticated, persistor, idToken } from '../../../store/authStore.js';
	import NavBarAdminPage from '../../../Sections/AdminPageSections/AdminNavbar.svelte';
	import AddUserModal from '../../../Components/AddUserComponent/AddUserModal.svelte';

	let rehydrated = false;
	let loading = true;
	let users = [];
	let errorMessage = '';
	let showAddUserModal = false; // To control modal visibility

	const axiosInstance = axios.create({
		baseURL: 'http://localhost:8000',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});

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
			goto('/admin/login');
		} else {
			fetchUserDetails();
		}
	}

	async function fetchUserDetails() {
		try {
			const currentIdToken = $idToken;

			if (!currentIdToken) {
				console.error('No idToken available');
				loading = false;
				return;
			}

			const response = await axiosInstance.get('/admin/userDetails', {
				headers: {
					Authorization: `Bearer ${currentIdToken}`,
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});

			const { user_details, total_users } = response.data;

			if (total_users === 0) {
				users = [];
				errorMessage = 'No users found in the database.';
			} else {
				users = user_details.map((user) => ({
					username: user.username,
					fullname: user.fullname,
					email: user.email,
					empType: user.emp_type
				}));
				errorMessage = '';
			}
		} catch (err) {
			errorMessage = 'Error fetching user details.';
			console.error(err);
		} finally {
			loading = false;
		}
	}

	function openAddUserModal() {
		showAddUserModal = true;
	}

	function closeAddUserModal() {
		showAddUserModal = false;
	}

	function handleUserAdded() {
		closeAddUserModal();
		fetchUserDetails(); // Refresh the user list after adding a new user
	}
</script>

<main class="flex min-h-screen flex-col overflow-hidden">
	<section id="nav-section">
		<NavBarAdminPage />
	</section>

	<section class="flex flex-col items-center justify-center p-8">
		<div class="container mx-auto p-6 text-white">
			{#if errorMessage}
				<div class="mb-4 rounded bg-red-500 p-3 text-white">{errorMessage}</div>
			{/if}

			{#if loading}
				<div class="flex items-center justify-center">
					<div
						class="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-purple-600"
					></div>
				</div>
			{:else}
				<div class="table-container">
					<h2 class="mb-6 flex items-center justify-center text-2xl">Manage Users</h2>

					<table
						class="w-full border-collapse border border-gray-500 text-center text-lg sm:table sm:text-base"
					>
						<thead class="hidden sm:table-header-group">
							<tr class="bg-[#462257] text-white">
								<th class="border border-gray-500 px-4 py-3">Username</th>
								<th class="border border-gray-500 px-4 py-3">Fullname</th>
								<th class="border border-gray-500 px-4 py-3">Email</th>
								<th class="border border-gray-500 px-4 py-3">Employee Type</th>
								<th class="border border-gray-500 px-4 py-3">Action</th>
							</tr>
						</thead>
						<tbody>
							{#each users as user}
								<tr class="block bg-[#6A427F] text-white sm:table-row sm:bg-transparent">
									<td class="block border border-gray-500 px-4 py-3 sm:table-cell">
										<strong class="sm:hidden">Username:</strong>
										{user.username}
									</td>
									<td class="block border border-gray-500 px-4 py-3 sm:table-cell">
										<strong class="sm:hidden">Fullname:</strong>
										{user.fullname}
									</td>
									<td class="block border border-gray-500 px-4 py-3 sm:table-cell">
										<strong class="sm:hidden">Email:</strong>
										{user.email}
									</td>
									<td class="block border border-gray-500 px-4 py-3 sm:table-cell">
										<strong class="sm:hidden">Employee Type:</strong>
										{user.empType}
									</td>
									<td class="block border border-gray-500 px-4 py-3 sm:table-cell">
										<button class="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
											🗑️
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>

					<!-- Add User Button -->
					<button
						class="mt-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
						on:click={openAddUserModal}
					>
						Add User
					</button>
				</div>
			{/if}
		</div>

		<!-- Conditionally render AddUserModal component -->
		{#if showAddUserModal}
			<AddUserModal on:close={closeAddUserModal} on:addUser={handleUserAdded} />
		{/if}
	</section>
</main>

<style>
	/* Styling here as per your original table styles */
</style>

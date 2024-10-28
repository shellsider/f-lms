<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isAuthenticated, persistor, idToken } from '../../../store/authStore.js';
	import NavBarAdminPage from '../../../Sections/AdminPageSections/AdminNavbar.svelte';
	import AddUserModal from '../../../Components/AddUserComponent/AddUserModal.svelte';
	import DeleteUserModal from '../../../Components/DeleteUserMdoal/DeleteUserModal.svelte';
	import { axiosInstance } from '../../../utils/axios.config.js';

	let rehydrated = false;
	let loading = true;
	let users = [];
	let errorMessage = '';
	let showAddUserModal = false;
	let showDeleteModal = false;
	let deleteUserEmail = '';
	let deleteLoading = false;

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
				loading = false;
				return;
			}
			const response = await axiosInstance.get('/admin/userDetails', {
				headers: { Authorization: `Bearer ${currentIdToken}` }
			});
			const { user_details, total_users } = response.data;
			users = total_users ? user_details : [];
			errorMessage = total_users ? '' : 'No users found in the database.';
		} catch (err) {
			errorMessage = 'Error fetching user details.';
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
		fetchUserDetails();
	}

	function openDeleteModal(email) {
		deleteUserEmail = email;
		showDeleteModal = true;
		console.log('openDeleteModal called:', showDeleteModal, deleteUserEmail);
	}

	function closeDeleteModal() {
		showDeleteModal = false;
		deleteUserEmail = '';
	}

	async function confirmDelete({ detail: { email } }) {
		deleteLoading = true;
		try {
			await axiosInstance.delete('/admin/deleteUser', {
				data: new URLSearchParams({ email }),
				headers: { Authorization: `Bearer ${$idToken}` }
			});
			closeDeleteModal();
			fetchUserDetails();
			errorMessage = ''; // Clear any previous error message
		} catch (err) {
			errorMessage = 'Error deleting user.';
		} finally {
			deleteLoading = false;
		}
	}
</script>

<main class="flex min-h-screen flex-col">
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
										<strong class="sm:hidden">Username:</strong>{user.username}
									</td>
									<td class="block border border-gray-500 px-4 py-3 sm:table-cell">
										<strong class="sm:hidden">Fullname:</strong>{user.fullname}
									</td>
									<td class="block border border-gray-500 px-4 py-3 sm:table-cell">
										<strong class="sm:hidden">Email:</strong>{user.email}
									</td>
									<td class="block border border-gray-500 px-4 py-3 sm:table-cell">
										<strong class="sm:hidden">Employee Type:</strong>{user.empType}
									</td>
									<td class="block border border-gray-500 px-4 py-3 sm:table-cell">
										<button
											class="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
											on:click={() => openDeleteModal(user.email)}
										>
											🗑️
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>

					<button
						class="mt-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
						on:click={openAddUserModal}
					>
						Add User
					</button>
				</div>
			{/if}
		</div>
	</section>
</main>

<!-- Modals moved outside of <main> -->
{#if showAddUserModal}
	<AddUserModal on:close={closeAddUserModal} on:addUser={handleUserAdded} />
{/if}

{#if showDeleteModal}
	<DeleteUserModal
		userEmail={deleteUserEmail}
		on:close={closeDeleteModal}
		on:confirmDelete={confirmDelete}
		loading={deleteLoading}
	/>
{/if}

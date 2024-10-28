<script>
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isAuthenticated, persistor, idToken } from '../../../store/authStore.js';
	import NavBarAdminPage from '../../../Sections/AdminPageSections/AdminNavbar.svelte';

	let rehydrated = false;
	let loading = false;
	let pendingLeaves = 0;
	let usersOnLeave = 0;
	let usersOnLeaveToday = [];

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
		}
	}

	function handleRefresh() {
		if (!$isAuthenticated) {
			goto('/admin/login');
			return;
		}
		loading = true;
		fetchAdminDashboardDetails();
	}

	async function fetchAdminDashboardDetails() {
		try {
			const currentIdToken = $idToken;
			if (!currentIdToken) {
				console.error('No idToken available');
				loading = false;
				return;
			}

			const currentDate = new Intl.DateTimeFormat('en-GB', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric'
			})
				.format(new Date())
				.replace(/\//g, '-');

			const response = await axiosInstance.get(`/admin/dashboard?date=${currentDate}`, {
				headers: {
					Authorization: `Bearer ${currentIdToken}`
				}
			});

			const { total_number_pending_leaves, total_number_approved_leaves, approved_users } =
				response.data;

			pendingLeaves = total_number_pending_leaves;
			usersOnLeave = total_number_approved_leaves;
			usersOnLeaveToday = approved_users.map((username) => ({
				fullname: username,
				upto: currentDate
			}));
		} catch (err) {
			console.error('Error fetching dashboard details:', err);
		} finally {
			loading = false;
		}
	}

	function viewLeaveDetails(user) {
		goto(`/admin/leaveDetail?fullname=${user.fullname}&upto=${user.upto}`);
	}
</script>

{#if rehydrated && $isAuthenticated}
	<main class="flex min-h-screen flex-col overflow-hidden">
		<section id="nav-section">
			<NavBarAdminPage />
		</section>

		<section id="form-section" class="flex flex-grow items-center justify-center">
			{#if loading}
				<div class="flex items-center justify-center">
					<div
						class="h-12 w-12 animate-spin rounded-full border-b-4 border-t-4 border-purple-600"
					></div>
				</div>
			{:else}
				<div class="container mx-auto p-6 text-white">
					<!-- Responsive Cards -->
					<div class="mb-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
						<a href="/admin/pendingLeaves" class="flex-1 no-underline">
							<div class="box flex cursor-pointer flex-col items-center justify-center">
								<h2 class="text-lg">Pending Leaves</h2>
								<p class="text-2xl font-semibold">{pendingLeaves}</p>
							</div>
						</a>

						<div class="box flex flex-1 flex-col items-center justify-center">
							<h2 class="text-lg">Users on Leave</h2>
							<p class="text-2xl font-semibold">{usersOnLeave}</p>
						</div>
					</div>

					<!-- Table Section with Refresh Button -->
					<div class="table-container">
						<h2 class="mb-4 flex items-center justify-center text-center text-xl">
							Users on Leave Today
							<button
								class="ml-4 rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
								on:click={handleRefresh}
								disabled={!$isAuthenticated}
							>
								Refresh
							</button>
						</h2>

						<!-- Responsive Table -->
						<table
							class="w-full table-auto border-collapse border border-gray-500 text-center text-sm sm:text-base"
						>
							<thead>
								<tr class="bg-[#462257] text-white">
									<th class="border border-gray-500 px-2 py-2">S.no</th>
									<th class="border border-gray-500 px-2 py-2">Fullname</th>
									<th class="border border-gray-500 px-2 py-2">Upto</th>
									<th class="border border-gray-500 px-2 py-2">Action</th>
								</tr>
							</thead>
							<tbody>
								{#if usersOnLeaveToday.length > 0}
									{#each usersOnLeaveToday as user, index}
										<tr class="bg-[#6A427F] text-white">
											<td class="border border-gray-500 px-2 py-2">{index + 1}</td>
											<td class="border border-gray-500 px-2 py-2">{user.fullname}</td>
											<td class="border border-gray-500 px-2 py-2">{user.upto}</td>
											<td class="border border-gray-500 px-2 py-2">
												<button
													class="rounded bg-[#1D3247] px-4 py-1 text-white hover:bg-[#3C5175]"
													on:click={() => viewLeaveDetails(user)}
												>
													View Details
												</button>
											</td>
										</tr>
									{/each}
								{:else}
									<tr class="bg-[#6A427F] text-white">
										<td class="border border-gray-500 px-2 py-2" colspan="4">
											No users on leave today.
										</td>
									</tr>
								{/if}
							</tbody>
						</table>
					</div>
				</div>
			{/if}
		</section>
	</main>
{:else}
	<div class="flex min-h-screen items-center justify-center">
		<div class="h-12 w-12 animate-spin rounded-full border-b-4 border-t-4 border-purple-600"></div>
	</div>
{/if}

<style>
	.container {
		max-width: 1200px;
	}

	.box {
		background-color: #330d52;
		padding: 30px;
		border-radius: 10px;
		width: 100%;
		height: 140px;
	}

	.table-container {
		max-height: 400px;
		overflow-y: auto;
	}

	table {
		background-color: #3c5175;
		width: 100%;
		border-collapse: collapse;
	}

	:global(body) {
		overflow: hidden;
		background-color: #1d3247;
	}

	main {
		height: 100vh;
	}
</style>

<script>
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { goto } from '$app/navigation';
	import { isAuthenticated, persistor, idToken } from '../../../store/authStore.js';
	import NavBarAdminPage from '../../../Sections/AdminPageSections/AdminNavbar.svelte';

	let rehydrated = false;
	let loading = true;
	let pendingLeaves = [];

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
			fetchPendingLeaves();
		}
	}

	async function fetchPendingLeaves() {
		try {
			const currentIdToken = $idToken;

			if (!currentIdToken) {
				console.error('No idToken available');
				loading = false;
				return;
			}

			const response = await axiosInstance.get('/admin/pendingLeaves', {
				headers: {
					Authorization: `Bearer ${currentIdToken}`,
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});

			const { total_number_pending_leaves, pending_leaves } = response.data;

			if (total_number_pending_leaves === 0) {
				pendingLeaves = [];
			} else {
				pendingLeaves = pending_leaves.map((leave) => ({
					id: leave.leave_id,
					username: leave.username,
					appliedOn: leave.applied_on,
					from: leave.from_date,
					to: leave.to_date,
					typeOfLeave: leave.leave_type
				}));
			}
		} catch (err) {
			console.error('Error fetching pending leaves:', err);
		} finally {
			loading = false;
		}
	}

	function viewDetails(leaveId) {
		// Navigate to the leave details page with the leaveId as a query parameter
		goto(`/admin/leaveDetail?leaveId=${leaveId}`);
	}
</script>

{#if rehydrated && $isAuthenticated}
	<main class="flex min-h-screen flex-col overflow-hidden">
		<section id="nav-section">
			<NavBarAdminPage />
		</section>

		<section id="table-section" class="flex flex-grow items-center justify-center">
			{#if loading}
				<div class="flex items-center justify-center">
					<div
						class="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-purple-600"
					></div>
				</div>
			{:else}
				<div class="container mx-auto mb-[20px] p-6 text-white">
					<div class="table-container">
						<h2 class="mb-6 flex items-center justify-center text-center text-2xl">
							Pending Leaves
							<button
								class="ml-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
								on:click={fetchPendingLeaves}
								disabled={!$isAuthenticated}
							>
								Refresh
							</button>
						</h2>

						<!-- Responsive Table -->
						<table
							class="w-full border-collapse border border-gray-500 text-center text-lg sm:table sm:text-base"
						>
							<thead class="hidden sm:table-header-group">
								<tr class="bg-[#462257] text-white">
									<th class="border border-gray-500 px-4 py-3">S.no</th>
									<th class="border border-gray-500 px-4 py-3">Username</th>
									<th class="border border-gray-500 px-4 py-3">Applied On</th>
									<th class="border border-gray-500 px-4 py-3">From</th>
									<th class="border border-gray-500 px-4 py-3">To</th>
									<th class="border border-gray-500 px-4 py-3">Type of Leave</th>
									<th class="border border-gray-500 px-4 py-3">Action</th>
								</tr>
							</thead>
							<tbody>
								{#if pendingLeaves.length > 0}
									{#each pendingLeaves as leave, index}
										<tr class="block bg-[#6A427F] text-white sm:table-row sm:bg-transparent">
											<td class="block border border-gray-500 px-4 py-3 sm:table-cell">
												<strong class="sm:hidden">S.no:</strong>
												{index + 1}
											</td>
											<td class="block border border-gray-500 px-4 py-3 sm:table-cell">
												<strong class="sm:hidden">Username:</strong>
												{leave.username}
											</td>
											<td class="block border border-gray-500 px-4 py-3 sm:table-cell">
												<strong class="sm:hidden">Applied On:</strong>
												{leave.appliedOn}
											</td>
											<td class="block border border-gray-500 px-4 py-3 sm:table-cell">
												<strong class="sm:hidden">From:</strong>
												{leave.from}
											</td>
											<td class="block border border-gray-500 px-4 py-3 sm:table-cell">
												<strong class="sm:hidden">To:</strong>
												{leave.to}
											</td>
											<td class="block border border-gray-500 px-4 py-3 sm:table-cell">
												<strong class="sm:hidden">Type of Leave:</strong>
												{leave.typeOfLeave}
											</td>
											<td class="block border border-gray-500 px-4 py-3 sm:table-cell">
												<button
													class="rounded bg-[#1D3247] px-4 py-2 text-white hover:bg-[#3C5175]"
													on:click={() => viewDetails(leave.id)}
												>
													View Details
												</button>
											</td>
										</tr>
									{/each}
								{:else}
									<tr class="bg-[#6A427F] text-white">
										<td class="border border-gray-500 px-4 py-3" colspan="7">
											No pending leaves found.
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
		<div class="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-purple-600"></div>
	</div>
{/if}

<style>
	.container {
		max-width: 1200px;
	}

	.table-container {
		max-height: 600px;
		overflow-y: auto;
	}

	table {
		background-color: #3c5175;
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		padding: 16px;
	}

	th {
		font-size: 1.2rem;
	}

	td {
		font-size: 1.1rem;
	}

	:global(body) {
		overflow: hidden;
		background-color: #1d3247;
	}

	main {
		height: 100vh;
	}

	@media (max-width: 640px) {
		td {
			display: block;
			text-align: left;
		}

		td strong {
			display: inline-block;
			width: 40%;
			color: #cbd5e0;
			font-weight: 600;
		}
	}
</style>

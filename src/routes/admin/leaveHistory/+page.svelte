<script>
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { goto } from '$app/navigation';
	import { isAuthenticated, persistor, idToken } from '../../../store/authStore.js';
	import NavBarAdminPage from '../../../Sections/AdminPageSections/AdminNavbar.svelte';

	let rehydrated = false;
	let loading = true;
	let allLeaves = [];

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
			fetchLeaves();
		}
	}

	async function fetchLeaves() {
		try {
			const currentIdToken = $idToken;

			if (!currentIdToken) {
				console.error('No idToken available');
				loading = false;
				return;
			}

			const response = await axiosInstance.get('/admin/fetchLeaves', {
				headers: {
					Authorization: `Bearer ${currentIdToken}`,
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});

			const {
				total_number_denied_leaves,
				denied_leaves,
				total_number_approved_leaves,
				approved_leaves
			} = response.data;

			allLeaves = [
				...approved_leaves.map((leave) => ({
					id: leave.leave_id,
					username: leave.username,
					appliedOn: leave.applied_on,
					from: leave.from_date,
					to: leave.to_date,
					typeOfLeave: leave.leave_type,
					status: 'Approved'
				})),
				...denied_leaves.map((leave) => ({
					id: leave.leave_id,
					username: leave.username,
					appliedOn: leave.applied_on,
					from: leave.from_date,
					to: leave.to_date,
					typeOfLeave: leave.leave_type,
					status: 'Denied'
				}))
			];

			allLeaves.sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn));
		} catch (err) {
			console.error('Error fetching leaves:', err);
		} finally {
			loading = false;
		}
	}

	function viewDetails(leaveId) {
		// Redirect to leaveDetail page with leaveId as a query parameter
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
				<div class="container mx-auto p-6 text-white">
					<div class="table-container">
						<h2 class="mb-6 flex items-center justify-center text-center text-2xl">
							Leave History
							<button
								class="ml-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
								on:click={fetchLeaves}
								disabled={!$isAuthenticated}
							>
								Refresh
							</button>
						</h2>

						<table
							class="w-full table-auto border-collapse border border-gray-500 text-center text-lg"
						>
							<thead>
								<tr class="bg-[#462257] text-white">
									<th class="border border-gray-500 py-3">S.no</th>
									<th class="border border-gray-500 py-3">Username</th>
									<th class="border border-gray-500 py-3">Applied On</th>
									<th class="border border-gray-500 py-3">From</th>
									<th class="border border-gray-500 py-3">To</th>
									<th class="border border-gray-500 py-3">Type of Leave</th>
									<th class="border border-gray-500 py-3">Status</th>
									<th class="border border-gray-500 py-3">Action</th>
								</tr>
							</thead>
							<tbody>
								{#if allLeaves.length > 0}
									{#each allLeaves as leave, index}
										<tr class="bg-[#6A427F] text-white">
											<td class="border border-gray-500 py-3">{index + 1}</td>
											<td class="border border-gray-500 py-3">{leave.username}</td>
											<td class="border border-gray-500 py-3">{leave.appliedOn}</td>
											<td class="border border-gray-500 py-3">{leave.from}</td>
											<td class="border border-gray-500 py-3">{leave.to}</td>
											<td class="border border-gray-500 py-3">{leave.typeOfLeave}</td>
											<td class="border border-gray-500 py-3">{leave.status}</td>
											<td class="border border-gray-500 py-3">
												<button
													class="rounded bg-[#1D3247] px-6 py-2 text-white hover:bg-[#3C5175]"
													on:click={() => viewDetails(leave.id)}
												>
													View Details
												</button>
											</td>
										</tr>
									{/each}
								{:else}
									<tr class="bg-[#6A427F] text-white">
										<td class="border border-gray-500 py-3" colspan="8">No leaves found.</td>
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
		max-height: 700px;
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
</style>

<script>
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { idToken } from '../../store/authStore.js'; // Adjust the path as necessary

	// Create axios instance
	const axiosInstance = axios.create({
		baseURL: 'http://localhost:8000', // Replace with your actual API base URL
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});

	let leaveHistory = [];
	let currentIdToken = null;
	let loading = true;
	let error = null;

	// Extract ID token from authStore
	const unsubscribeIdToken = idToken.subscribe((value) => {
		currentIdToken = value;
	});

	// Fetch leave history on component mount
	async function fetchLeaveHistory() {
		try {
			const response = await axiosInstance.get('/myLeaveHistory', {
				headers: {
					Authorization: `Bearer ${currentIdToken}`
				}
			});
			const data = response.data;
			leaveHistory = data.leave_history || [];
		} catch (err) {
			error = err.response?.data?.detail || 'Failed to fetch leave history.';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		console.log('In On Mount');
		fetchLeaveHistory();
	});
</script>

{#if loading}
	<div class="text-center text-white">Loading leave history...</div>
{:else if error}
	<div class="text-center text-red-500">{error}</div>
{:else}
	<div class="mt-4 flex w-full flex-col items-center px-4 py-6">
		<h2 class="mb-6 text-2xl font-semibold text-[#e0d9e4]">Leave History</h2>

		<div class="w-full max-w-5xl overflow-y-auto rounded-lg bg-[#3b264f] text-[#e0d9e4] shadow-md">
			<table class="w-full">
				<thead>
					<tr class="bg-[#200d3f]">
						<th class="px-4 py-2 text-left">S.no</th>
						<th class="px-4 py-2 text-left">Applied On</th>
						<th class="px-4 py-2 text-left">From</th>
						<th class="px-4 py-2 text-left">To</th>
						<th class="px-4 py-2 text-left">Type of Leave</th>
						<th class="px-4 py-2 text-left">Status</th>
						<th class="px-4 py-2 text-left">Reason</th>
						<th class="px-4 py-2 text-left">Admin Remark</th>
					</tr>
				</thead>
				<tbody>
					{#each leaveHistory as leave, index}
						<tr class="border-b border-[#453354] transition hover:bg-[#2c1c3c]">
							<td class="px-4 py-3">{index + 1}</td>
							<td class="px-4 py-3">{leave.applied_on}</td>
							<td class="px-4 py-3">{leave.from_date}</td>
							<td class="px-4 py-3">{leave.to_date}</td>
							<td class="px-4 py-3">{leave.leave_type}</td>
							<td class="px-4 py-3">{leave.status}</td>
							<td class="px-4 py-3">{leave.reason_for_leave}</td>
							<td class="px-4 py-3">{leave.admin_remark}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}

<style>
	@media (max-width: 768px) {
		table {
			font-size: 0.875rem; /* Slightly smaller text for mobile */
		}
		th,
		td {
			padding: 0.5rem; /* Smaller padding for better fit on mobile */
		}
	}
	/* Scrollbar styling within table */
	div > .w-full.overflow-y-auto {
		max-height: 60vh; /* Restrict the height of the table */
	}
</style>

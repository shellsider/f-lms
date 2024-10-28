<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isAuthenticated, persistor, idToken } from '../../../store/authStore.js';
	import NavBarAdminPage from '../../../Sections/AdminPageSections/AdminNavbar.svelte';
	import axios from 'axios';
	import { page } from '$app/stores';

	let rehydrated = false;
	let loading = true; // Set to true initially for loading state
	let leaveDetails = null;
	let adminRemarks = '';
	let statusOptions = ['approved', 'denied'];
	let selectedStatus = '';
	let errorMessage = '';
	let successMessage = '';

	const axiosInstance = axios.create({
		baseURL: 'http://localhost:8000',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});

	let currentIdToken;

	// Use a reactive statement to subscribe to the idToken store and persist the token
	const unsubscribe = idToken.subscribe((token) => {
		currentIdToken = token;
	});

	onMount(() => {
		if (typeof window !== 'undefined') {
			persistor.persist();

			if (persistor.getState().bootstrapped) {
				rehydrated = true;
				checkAuthAndFetchData();
			} else {
				const unsubscribe = persistor.subscribe(() => {
					if (persistor.getState().bootstrapped) {
						rehydrated = true;
						unsubscribe();
						checkAuthAndFetchData();
					}
				});
			}
		} else {
			rehydrated = true;
		}
	});

	// Check authentication and fetch leave details if authenticated
	function checkAuthAndFetchData() {
		if (!$isAuthenticated) {
			goto('/admin/login');
		} else {
			fetchLeaveDetails();
		}
	}

	async function fetchLeaveDetails() {
		const query = $page.url.searchParams;
		const leaveId = query.get('leaveId');

		if (!leaveId) {
			errorMessage = 'No leave ID provided in the query parameters.';
			loading = false;
			return;
		}

		try {
			if (!currentIdToken) {
				errorMessage = 'No idToken available';
				loading = false;
				return;
			}

			const response = await axiosInstance.get('/admin/leave', {
				params: { leave_id: leaveId },
				headers: {
					Authorization: `Bearer ${currentIdToken}`
				}
			});
			const data = response.data;
			leaveDetails = data.leave_details;

			// Set the adminRemarks only if there is already an existing remark in the leaveDetails
			adminRemarks = leaveDetails.admin_remarks || '';
			selectedStatus = leaveDetails.status || '';
			errorMessage = ''; // Clear any previous error message
		} catch (error) {
			if (error.response && error.response.data && error.response.data.detail) {
				errorMessage = error.response.data.detail;
			} else {
				errorMessage = error.message;
			}
		} finally {
			loading = false;
		}
	}

	async function updateStatus() {
		if (!selectedStatus) {
			errorMessage = 'Please select a status.';
			return;
		}

		try {
			const formData = new URLSearchParams();
			formData.append('leave_id', leaveDetails.leave_id);
			formData.append('status', selectedStatus);
			formData.append('admin_remarks', adminRemarks);

			const response = await axiosInstance.put('/admin/update-leave-status', formData, {
				headers: {
					Authorization: `Bearer ${currentIdToken}`,
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});

			const data = response.data;
			// successMessage = data.message;
			successMessage = 'Leave Status Updated';
			leaveDetails.status = selectedStatus; // Update status in leaveDetails
			errorMessage = ''; // Clear any previous error message
		} catch (error) {
			if (error.response && error.response.data && error.response.data.detail) {
				errorMessage = error.response.data.detail;
			} else {
				errorMessage = error.message;
			}
			successMessage = '';
		}
	}
</script>

<main class="flex min-h-screen flex-col overflow-hidden bg-[#1D3247]">
	<section id="nav-section">
		<NavBarAdminPage />
	</section>
	<section class="flex items-center justify-center bg-[#1D3247] p-8">
		<div class="w-full max-w-4xl rounded-lg bg-[#330D52] p-6 text-white shadow-md">
			{#if errorMessage}
				<div class="mb-4 rounded bg-red-500 p-3 text-white">{errorMessage}</div>
			{/if}
			{#if successMessage}
				<div class="mb-4 rounded bg-green-500 p-3 text-white">{successMessage}</div>
			{/if}
			{#if loading}
				<!-- Loading Spinner -->
				<div class="flex items-center justify-center">
					<div
						class="h-12 w-12 animate-spin rounded-full border-b-4 border-t-4 border-purple-600"
					></div>
				</div>
			{:else if leaveDetails}
				<h1 class="mb-4 text-2xl font-bold">Leave Details</h1>

				<!-- Display Leave Details -->
				<div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<p><strong>Username:</strong> {leaveDetails.username}</p>
						<p><strong>Leave Type:</strong> {leaveDetails.leave_type}</p>
						<p><strong>Reason for Leave:</strong> {leaveDetails.reason_for_leave}</p>
						<p><strong>No. of Days:</strong> {leaveDetails.no_of_days}</p>
					</div>
					<div>
						<p><strong>From Date:</strong> {leaveDetails.from_date}</p>
						<p><strong>To Date:</strong> {leaveDetails.to_date}</p>
						<p><strong>Applied On:</strong> {leaveDetails.applied_on}</p>
						<p><strong>Half Day:</strong> {leaveDetails.half ? leaveDetails.half : 'None'}</p>
					</div>
				</div>
				<div class="mb-4">
					<p><strong>Status:</strong> {leaveDetails.status}</p>
				</div>

				<!-- Display Adjusted To Details -->
				{#if leaveDetails.adjusted_to}
					<div class="mb-4">
						<h2 class="mb-2 text-xl font-semibold">Adjusted To:</h2>
						{#each Object.entries(leaveDetails.adjusted_to) as [date, shifts]}
							<p class="font-bold">{date}:</p>
							<ul class="ml-4">
								{#each Object.entries(shifts) as [time, name]}
									<li>{time}: {name}</li>
								{/each}
							</ul>
						{/each}
					</div>
				{/if}

				<!-- Admin Remarks -->
				<div class="mb-4">
					<label for="adminRemarks" class="mb-2 block text-lg font-semibold">Admin Remarks:</label>
					<textarea
						id="adminRemarks"
						class="w-full rounded p-2 text-black"
						bind:value={adminRemarks}
						rows="4"
					></textarea>
				</div>

				<!-- Update Status -->
				<div class="mb-4">
					<label class="mb-2 block text-lg font-semibold">Update Status:</label>
					<div class="mb-4 flex items-center">
						{#each statusOptions as status}
							<label class="mr-4">
								<input
									type="radio"
									name="status"
									value={status}
									bind:group={selectedStatus}
									class="mr-1"
								/>
								{status.charAt(0).toUpperCase() + status.slice(1)}
							</label>
						{/each}
					</div>
					<button
						on:click={updateStatus}
						class="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
					>
						Update Status
					</button>
				</div>
			{/if}
		</div>
	</section>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Inter', sans-serif;
		background-color: #1d3247;
		overflow-x: hidden;
		overflow-y: auto;
	}
</style>

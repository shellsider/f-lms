<script>
	import { writable } from 'svelte/store';
	import 'flatpickr/dist/flatpickr.css';
	import { axiosInstance } from '../../utils/axios.config.js';

	// Import the readable stores from authStore.js
	import { idToken, username } from '../../store/authStore.js'; // Adjust the path as necessary

	// Local state variables
	let leaveType = '';
	let fromDate = null;
	let toDate = null;
	let reasonForLeave = '';
	const noOfDays = writable(0);

	// Store for lecture adjustments
	let lectureAdjustments = [{ date: '', half: 'full', timeSlots: [{ time: '', name: '' }] }];

	// Error state
	let errors = {
		leaveType: '',
		fromDate: '',
		toDate: '',
		reasonForLeave: '',
		lectureAdjustments: []
	};

	// Function to extract string format from date
	function extractDateInfo(dateString) {
		const datePart = dateString.split('T')[0];
		const [year, month, day] = datePart.split('-');
		return {
			dateString: `${day}-${month}-${year}`
		};
	}

	// Store for available dates
	const availableDates = writable([]);

	// Watch fromDate and toDate to update available dates and re-render the dropdowns
	$: if (fromDate && toDate) {
		updateNoOfDays();
		populateAvailableDates();
		refreshLectureAdjustments();
	}

	// Populate available dates based on fromDate to toDate
	function populateAvailableDates() {
		let dateList = [];
		const startDate = new Date(fromDate);
		const endDate = new Date(toDate);
		while (startDate <= endDate) {
			dateList.push(extractDateInfo(startDate.toISOString()).dateString);
			startDate.setDate(startDate.getDate() + 1);
		}
		availableDates.set(dateList);
	}

	// Refresh lecture adjustments to ensure dropdowns are updated
	function refreshLectureAdjustments() {
		lectureAdjustments = [...lectureAdjustments];
	}

	function updateNoOfDays() {
		if (fromDate && toDate) {
			const start = new Date(fromDate);
			const end = new Date(toDate);
			const diffTime = end - start;
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
			noOfDays.set(diffDays);
		}
	}

	// === Incorporate Your Existing Add/Remove Functions ===

	// Function to add a new Date and Half row
	function addLectureAdjustment() {
		lectureAdjustments = [
			...lectureAdjustments,
			{ date: '', half: 'full', timeSlots: [{ time: '', name: '' }] }
		];
		errors.lectureAdjustments.push({ date: '', half: '', timeSlots: [] });
	}

	// Function to add a new Time Slot and Name within a Date and Half row
	function addTimeSlot(index) {
		lectureAdjustments[index].timeSlots.push({ time: '', name: '' });
		lectureAdjustments = [...lectureAdjustments];
		if (!errors.lectureAdjustments[index].timeSlots) {
			errors.lectureAdjustments[index].timeSlots = [];
		}
		errors.lectureAdjustments[index].timeSlots.push({ time: '', name: '' });
	}

	// Function to remove a Date and Half row
	function removeLectureAdjustment(index) {
		if (lectureAdjustments.length > 1) {
			lectureAdjustments.splice(index, 1);
			errors.lectureAdjustments.splice(index, 1);
			lectureAdjustments = [...lectureAdjustments];
		}
	}

	// Function to remove a Time Slot row
	function removeTimeSlot(adjustmentIndex, slotIndex) {
		if (lectureAdjustments[adjustmentIndex].timeSlots.length > 1) {
			lectureAdjustments[adjustmentIndex].timeSlots.splice(slotIndex, 1);
			errors.lectureAdjustments[adjustmentIndex].timeSlots.splice(slotIndex, 1);
			lectureAdjustments = [...lectureAdjustments];
		}
	}

	// === End of Your Existing Add/Remove Functions ===

	const timeSlots = [
		'08:00-09:00',
		'09:00-10:00',
		'10:00-11:00',
		'11:00-12:00',
		'12:30-13:30',
		'13:30-14:30',
		'14:30-15:30',
		'15:30-16:30',
		'16:30-17:30'
	];

	// Function to get the minimum date (tomorrow's date)
	function getTomorrowDate() {
		const today = new Date();
		today.setDate(today.getDate() + 1);
		return today.toISOString().split('T')[0];
	}

	// Utility function to transform lectureAdjustments to adjusted_to
	function transformLectureAdjustments(adjustments) {
		const adjustedTo = {};

		adjustments.forEach((adjustment) => {
			if (adjustment.date) {
				adjustedTo[adjustment.date] = {};
				adjustment.timeSlots.forEach((slot) => {
					if (slot.time && slot.name) {
						adjustedTo[adjustment.date][slot.time] = slot.name;
					}
				});
			}
		});

		return adjustedTo;
	}

	// Local variables to hold the current idToken and username
	let currentIdToken = null;
	let currentUsername = null;

	// Subscribe to the idToken and username stores
	const unsubscribeIdToken = idToken.subscribe((value) => {
		currentIdToken = value;
	});

	const unsubscribeUsername = username.subscribe((value) => {
		currentUsername = value;
	});

	// Cleanup subscriptions when the component is destroyed
	import { onDestroy } from 'svelte';
	import { error } from '@sveltejs/kit';
	onDestroy(() => {
		unsubscribeIdToken();
		unsubscribeUsername();
	});

	async function handleSubmit() {
		// Reset errors
		errors = {
			leaveType: '',
			fromDate: '',
			toDate: '',
			reasonForLeave: '',
			lectureAdjustments: lectureAdjustments.map(() => ({ date: '', half: '', timeSlots: [] })),
			noOfDaysStatus: ''
		};

		// Validation
		// 1. Static Fields
		if (!leaveType) {
			errors.leaveType = 'Leave Type is required.';
		}
		if ($noOfDays <= 0) {
			errors.noOfDaysStatus = 'Invalid Date Selected';
		}
		if (!fromDate) {
			errors.fromDate = 'From Date is required.';
		}
		if (!toDate) {
			errors.toDate = 'To Date is required.';
		}
		if (!reasonForLeave) {
			errors.reasonForLeave = 'Reason for Leave is required.';
		}

		// 2. Lecture Adjustments
		lectureAdjustments.forEach((adjustment, adjIndex) => {
			if (!adjustment.date) {
				errors.lectureAdjustments[adjIndex].date = 'Date is required.';
			}
			if (!adjustment.half) {
				errors.lectureAdjustments[adjIndex].half = 'Half selection is required.';
			}
			adjustment.timeSlots.forEach((slot, slotIndex) => {
				if (!slot.time) {
					errors.lectureAdjustments[adjIndex].timeSlots[slotIndex] = {
						...errors.lectureAdjustments[adjIndex].timeSlots[slotIndex],
						time: 'Time is required.'
					};
				}
				if (!slot.name.trim()) {
					errors.lectureAdjustments[adjIndex].timeSlots[slotIndex] = {
						...errors.lectureAdjustments[adjIndex].timeSlots[slotIndex],
						name: 'Name is required.'
					};
				}
			});
		});

		// Check if there are any errors
		const hasErrors = Object.values(errors).some((error) =>
			typeof error === 'string'
				? error !== ''
				: Object.values(error).some((subError) =>
						typeof subError === 'string'
							? subError !== ''
							: Object.values(subError).some((msg) => msg !== '')
					)
		);

		if (hasErrors) {
			// Collect all error messages to display
			console.log('In Has errors', errors);

			let containsError = false;
			let wentInIfCheck = false;

			// Check if main fields are empty
			if (
				errors.leaveType === '' &&
				errors.fromDate === '' &&
				errors.toDate === '' &&
				errors.reasonForLeave === '' &&
				errors.noOfDaysStatus === ''
			) {
				// Check for lecture adjustments
				errors.lectureAdjustments.forEach((lecture) => {
					if (lecture.date !== '' || lecture.half !== '' || lecture.timeSlots.length > 0) {
						wentInIfCheck = true;
						containsError = true;
					}
				});
			} else {
				containsError = true;
			}

			if (containsError) {
				const errorMessages = [];

				if (errors.leaveType) errorMessages.push(errors.leaveType);
				if (errors.fromDate) errorMessages.push(errors.fromDate);
				if (errors.toDate) errorMessages.push(errors.toDate);
				if (errors.reasonForLeave) errorMessages.push(errors.reasonForLeave);
				if (errors.noOfDaysStatus) errorMessages.push(errors.noOfDaysStatus);

				errors.lectureAdjustments.forEach((adjError, adjIndex) => {
					if (adjError.date) {
						errorMessages.push(`Lecture Adjustment ${adjIndex + 1}: ${adjError.date}`);
					}
					if (adjError.half) {
						errorMessages.push(`Lecture Adjustment ${adjIndex + 1}: ${adjError.half}`);
					}
					adjError.timeSlots.forEach((slotError, slotIndex) => {
						if (slotError.time) {
							errorMessages.push(
								`Lecture Adjustment ${adjIndex + 1}, Time Slot ${slotIndex + 1}: ${slotError.time}`
							);
						}
						if (slotError.name) {
							errorMessages.push(
								`Lecture Adjustment ${adjIndex + 1}, Time Slot ${slotIndex + 1}: ${slotError.name}`
							);
						}
					});
				});

				alert(errorMessages.join('\n'));
				return; // Prevent submission
			}
		}

		try {
			// Ensure the user is authenticated
			if (!currentIdToken || !currentUsername) {
				alert('You are not authenticated. Please log in again.');
				return;
			}

			console.log('DEBUG Token', currentIdToken);

			// Get the current date in 'DD-MM-YYYY' format
			const today = new Date();
			const appliedOnDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

			// Transform lectureAdjustments to adjusted_to
			const adjustedTo = transformLectureAdjustments(lectureAdjustments);

			// Construct the form data
			const formData = new URLSearchParams();
			formData.append('leave_type', leaveType);
			formData.append('half', 'full'); // Adjust if necessary based on your form inputs
			formData.append('from_date', fromDate.split('-').reverse().join('-')); // Convert to 'DD-MM-YYYY'
			formData.append('to_date', toDate.split('-').reverse().join('-')); // Convert to 'DD-MM-YYYY'
			formData.append('no_of_days', $noOfDays.toString());
			formData.append('applied_on', appliedOnDate);
			formData.append('reason_for_leave', reasonForLeave);
			formData.append('adjusted_to', JSON.stringify(adjustedTo));
			formData.append('username', currentUsername);

			// Debugging: Log the form data
			console.log('Submitting Form Data:', formData.toString());

			// Make the POST request
			const response = await axiosInstance.post('/applyLeave', formData, {
				headers: {
					Authorization: `Bearer ${currentIdToken}`,
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});

			// Debugging: Log the entire response
			console.log('API Response:', response);

			// Handle success
			if (response.data && response.data.message) {
				alert(response.data.message);
			} else {
				alert('Form submitted successfully.');
			}

			// Optionally, reset the form or redirect the user
			resetForm();
		} catch (error) {
			// Handle errors
			console.error('Submission Error:', error);
			if (error.response) {
				// Server responded with a status other than 2xx
				if (error.response.data && error.response.data.detail) {
					alert(`Error: ${error.response.data.detail}`);
				} else {
					alert(`Error: ${error.response.statusText}`);
				}
			} else if (error.request) {
				// Request was made but no response received
				alert('Error: No response from the server.');
			} else {
				// Something else happened
				alert(`Error: ${error.message}`);
			}
		}
	}

	// Optional: Function to reset the form after successful submission
	function resetForm() {
		leaveType = '';
		fromDate = null;
		toDate = null;
		reasonForLeave = '';
		noOfDays.set(0);
		lectureAdjustments = [{ date: '', half: 'full', timeSlots: [{ time: '', name: '' }] }];
		errors = {
			leaveType: '',
			fromDate: '',
			toDate: '',
			reasonForLeave: '',
			lectureAdjustments: []
		};
	}
</script>

<div
	class="mx-auto mb-[100px] mt-[100px] max-w-4xl rounded-xl bg-[#23203a] p-6 text-gray-200 shadow-lg"
>
	<h2 class="mb-6 text-center text-2xl font-semibold">Apply Leave</h2>

	<div class="space-y-4">
		<!-- Leave Type -->
		<div>
			<label class="mb-1 block text-sm font-medium">Leave Type</label>
			<select
				bind:value={leaveType}
				class="w-full rounded-lg border border-gray-600 bg-[#19162a] p-2 focus:outline-none {errors.leaveType
					? 'error'
					: ''}"
				required
			>
				<option value="">Select Leave Type</option>
				<option value="CL">Casual Leave</option>
				<option value="EL">Earned Leave</option>
				<!-- Add other leave types as needed -->
			</select>
			{#if errors.leaveType}
				<p class="mt-1 text-sm text-red-500">{errors.leaveType}</p>
			{/if}
		</div>

		<!-- Date Range -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<div>
				<label class="mb-1 block text-sm font-medium">From Date</label>
				<input
					type="date"
					bind:value={fromDate}
					class="w-full rounded-lg border border-gray-600 bg-[#19162a] p-2 focus:outline-none {errors.fromDate
						? 'error'
						: ''}"
					min={getTomorrowDate()}
					required
				/>
				{#if errors.fromDate}
					<p class="mt-1 text-sm text-red-500">{errors.fromDate}</p>
				{/if}
			</div>
			<div>
				<label class="mb-1 block text-sm font-medium">To Date</label>
				<input
					type="date"
					bind:value={toDate}
					class="w-full rounded-lg border border-gray-600 bg-[#19162a] p-2 focus:outline-none {errors.toDate
						? 'error'
						: ''}"
					min={fromDate || getTomorrowDate()}
					required
				/>
				{#if errors.toDate}
					<p class="mt-1 text-sm text-red-500">{errors.toDate}</p>
				{/if}
			</div>
			<div>
				<label class="mb-1 block text-sm font-medium">No. of Days</label>
				<input
					type="text"
					bind:value={$noOfDays}
					class="w-full rounded-lg border border-gray-600 bg-[#19162a] p-2 focus:outline-none"
					readonly
				/>
			</div>
		</div>

		<!-- Reason for Leave -->
		<div>
			<label class="mb-1 block text-sm font-medium">Reason for Leave</label>
			<textarea
				bind:value={reasonForLeave}
				class="w-full rounded-lg border border-gray-600 bg-[#19162a] p-2 focus:outline-none {errors.reasonForLeave
					? 'error'
					: ''}"
				rows="3"
				required
			></textarea>
			{#if errors.reasonForLeave}
				<p class="mt-1 text-sm text-red-500">{errors.reasonForLeave}</p>
			{/if}
		</div>

		<!-- Lecture Adjustment Section -->
		<div class="mt-6 rounded-lg bg-[#1e1b33] p-4">
			<h3 class="mb-4 text-lg font-semibold">Lecture Adjustment</h3>

			{#each lectureAdjustments as adjustment, index}
				<div class="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
					<div>
						<label class="mb-1 block text-sm font-medium">Choose Date</label>
						<select
							bind:value={lectureAdjustments[index].date}
							class="w-full rounded-lg border border-gray-600 bg-[#19162a] p-2 focus:outline-none {errors
								.lectureAdjustments[index] && errors.lectureAdjustments[index].date
								? 'error'
								: ''}"
							required
						>
							<option value="">Select Date</option>
							{#each $availableDates as date}
								<option value={date}>{date}</option>
							{/each}
						</select>
						{#if errors.lectureAdjustments[index] && errors.lectureAdjustments[index].date}
							<p class="mt-1 text-sm text-red-500">{errors.lectureAdjustments[index].date}</p>
						{/if}
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium">Half</label>
						<select
							bind:value={lectureAdjustments[index].half}
							class="w-full rounded-lg border border-gray-600 bg-[#19162a] p-2 focus:outline-none {errors
								.lectureAdjustments[index] && errors.lectureAdjustments[index].half
								? 'error'
								: ''}"
							required
						>
							<option value="full">Full Day</option>
							<option value="first">First Half</option>
							<option value="second">Second Half</option>
						</select>
						{#if errors.lectureAdjustments[index] && errors.lectureAdjustments[index].half}
							<p class="mt-1 text-sm text-red-500">{errors.lectureAdjustments[index].half}</p>
						{/if}
					</div>
					<div class="flex items-center space-x-2">
						<button
							type="button"
							class="rounded-lg bg-green-500 p-2 text-white"
							on:click={addLectureAdjustment}
							title="Add Lecture Adjustment"
						>
							+
						</button>
						{#if lectureAdjustments.length > 1}
							<button
								type="button"
								class="p-2 text-white"
								on:click={() => removeLectureAdjustment(index)}
								title="Remove Lecture Adjustment"
							>
								🗑️
							</button>
						{/if}
					</div>
				</div>

				<!-- Time Slot and Enter Name Rows -->
				{#each adjustment.timeSlots as slot, slotIndex}
					<div class="mb-2 ml-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
						<div>
							<label class="mb-1 block text-sm font-medium">Choose Time Slot</label>
							<select
								bind:value={lectureAdjustments[index].timeSlots[slotIndex].time}
								class="w-full rounded-lg border border-gray-600 bg-[#19162a] p-2 focus:outline-none {errors
									.lectureAdjustments[index] &&
								errors.lectureAdjustments[index].timeSlots[slotIndex] &&
								errors.lectureAdjustments[index].timeSlots[slotIndex].time
									? 'error'
									: ''}"
								required
							>
								<option value="">Select Time Slot</option>
								{#each timeSlots as timeslot}
									<option value={timeslot}>{timeslot}</option>
								{/each}
							</select>
							{#if errors.lectureAdjustments[index] && errors.lectureAdjustments[index].timeSlots[slotIndex] && errors.lectureAdjustments[index].timeSlots[slotIndex].time}
								<p class="mt-1 text-sm text-red-500">
									{errors.lectureAdjustments[index].timeSlots[slotIndex].time}
								</p>
							{/if}
						</div>
						<div>
							<label class="mb-1 block text-sm font-medium">Enter Name</label>
							<input
								type="text"
								bind:value={lectureAdjustments[index].timeSlots[slotIndex].name}
								class="w-full rounded-lg border border-gray-600 bg-[#19162a] p-2 focus:outline-none {errors
									.lectureAdjustments[index] &&
								errors.lectureAdjustments[index].timeSlots[slotIndex] &&
								errors.lectureAdjustments[index].timeSlots[slotIndex].name
									? 'error'
									: ''}"
								placeholder="Enter Name"
								required
							/>
							{#if errors.lectureAdjustments[index] && errors.lectureAdjustments[index].timeSlots[slotIndex] && errors.lectureAdjustments[index].timeSlots[slotIndex].name}
								<p class="mt-1 text-sm text-red-500">
									{errors.lectureAdjustments[index].timeSlots[slotIndex].name}
								</p>
							{/if}
						</div>
						<div class="flex items-center space-x-2">
							<button
								type="button"
								class="rounded-lg bg-green-500 p-2 text-white"
								on:click={() => addTimeSlot(index)}
								title="Add Time Slot"
							>
								+
							</button>
							{#if adjustment.timeSlots.length > 1}
								<button
									type="button"
									class="p-2 text-white"
									on:click={() => removeTimeSlot(index, slotIndex)}
									title="Remove Time Slot"
								>
									🗑️
								</button>
							{/if}
						</div>
					</div>
				{/each}
			{/each}
		</div>

		<!-- Display Validation Errors (Optional) -->
		{#if errors.length > 0}
			<div class="mt-4 rounded-md bg-red-100 p-4">
				<ul class="list-disc pl-5 text-red-700">
					{#each errors as error}
						<li>{error}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Submit Button -->
		<div class="mt-6 text-center">
			<button
				type="button"
				class="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 focus:outline-none"
				on:click={handleSubmit}
			>
				Submit
			</button>
		</div>
	</div>
</div>

<style>
	/* Add any necessary styles here */
	.error {
		border-color: red;
	}
</style>

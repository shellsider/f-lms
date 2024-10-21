<script>
	import { writable, get } from 'svelte/store';
	import 'flatpickr/dist/flatpickr.css';

	let leaveType = '';
	let fromDate = null;
	let toDate = null;
	let reasonForLeave = '';
	const noOfDays = writable(0);

	// Store for lecture adjustments
	let lectureAdjustments = [{ date: '', half: 'full', timeSlots: [{ time: '', name: '' }] }];

	// Function to extract string format from date
	function extractDateInfo(dateString) {
		const datePart = dateString.split('T')[0];
		const [year, month, day] = datePart.split('-');
		return {
			dateString: `${day}-${month}-${String(year).trim().slice(1)}`
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
			const diffTime = Math.abs(new Date(toDate) - new Date(fromDate));
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
			noOfDays.set(diffDays);
		}
	}

	// Function to add a new Date and Half row
	function addLectureAdjustment() {
		lectureAdjustments = [
			...lectureAdjustments,
			{ date: '', half: '', timeSlots: [{ time: '', name: '' }] }
		];
	}

	// Function to add a new Time Slot and Name within a Date and Half row
	function addTimeSlot(index) {
		lectureAdjustments[index].timeSlots.push({ time: '', name: '' });
		lectureAdjustments = [...lectureAdjustments];
	}

	// Function to remove a Date and Half row
	function removeLectureAdjustment(index) {
		if (index > 0) {
			lectureAdjustments.splice(index, 1);
			lectureAdjustments = [...lectureAdjustments];
		}
	}

	// Function to remove a Time Slot row
	function removeTimeSlot(adjustmentIndex, slotIndex) {
		if (adjustmentIndex > 0 || slotIndex > 0) {
			lectureAdjustments[adjustmentIndex].timeSlots.splice(slotIndex, 1);
			lectureAdjustments = [...lectureAdjustments];
		}
	}

	const timeSlots = [
		'08:00  - 09:00 ',
		'09:00  - 10:00 ',
		'10:00  - 11:00 ',
		'11:00  - 12:00 ',
		'12:30  - 01:30 ',
		'01:30  - 02:30 ',
		'02:30  - 03:30 ',
		'03:30  - 04:30 ',
		'04:30  - 05:30 '
	];

	// Function to get the minimum date (tomorrow's date)
	function getTomorrowDate() {
		const today = new Date();
		today.setDate(today.getDate() + 1);
		return today.toISOString().split('T')[0];
	}
</script>

<div class="mx-auto max-w-4xl rounded-xl bg-[#23203a] p-6 text-gray-200 shadow-lg">
	<h2 class="mb-6 text-center text-2xl font-semibold">Apply Leave</h2>

	<div class="space-y-4">
		<!-- Leave Type -->
		<div>
			<label class="mb-1 block text-sm font-medium">Leave Type</label>
			<select class="w-full rounded-lg border border-gray-600 bg-[#19162a] p-2 focus:outline-none">
				<option value="">Select Leave Type</option>
				<option value="casual">Casual Leave</option>
			</select>
		</div>

		<!-- Date Range -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<div>
				<label class="mb-1 block text-sm font-medium">From Date</label>
				<input
					type="date"
					bind:value={fromDate}
					class="w-full rounded-lg border border-gray-600 bg-[#19162a] p-2 focus:outline-none"
					min={getTomorrowDate()}
				/>
			</div>
			<div>
				<label class="mb-1 block text-sm font-medium">To Date</label>
				<input
					type="date"
					bind:value={toDate}
					class="w-full rounded-lg border border-gray-600 bg-[#19162a] p-2 focus:outline-none"
					min={getTomorrowDate()}
				/>
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
				class="w-full rounded-lg border border-gray-600 bg-[#19162a] p-2 focus:outline-none"
				rows="3"
			></textarea>
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
							class="w-full rounded-lg border border-gray-600 bg-[#19162a] p-2 focus:outline-none"
						>
							<option value="">Select Date</option>
							{#each $availableDates as date}
								<option value={date}>{date}</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium">Half</label>
						<select
							bind:value={lectureAdjustments[index].half}
							class="w-full rounded-lg border border-gray-600 bg-[#19162a] p-2 focus:outline-none"
						>
							<option value="full">Full Day</option>
							<option value="first">First Half</option>
							<option value="second">Second Half</option>
						</select>
					</div>
					<div class="flex items-center space-x-2">
						<button class="rounded-lg bg-red-500 p-2 text-white" on:click={addLectureAdjustment}
							>+</button
						>
						{#if index > 0}
							<button class="p-2 text-white" on:click={() => removeLectureAdjustment(index)}
								>🗑️</button
							>
						{/if}
					</div>
				</div>

				<!-- Time Slot and Enter Name Rows -->
				{#each adjustment.timeSlots as slot, slotIndex}
					<div class="mb-2 ml-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
						<div>
							<label class="mb-1 block text-sm font-medium">Choose Time Slot</label>
							<select
								class="w-full rounded-lg border border-gray-600 bg-[#19162a] p-2 focus:outline-none"
							>
								{#each timeSlots as timeslot, i}
									<option value="">{timeslot}</option>
								{/each}
							</select>
						</div>
						<div>
							<label class="mb-1 block text-sm font-medium">Enter Name</label>
							<input
								type="text"
								class="w-full rounded-lg border border-gray-600 bg-[#19162a] p-2 focus:outline-none"
							/>
						</div>
						<div class="flex items-center space-x-2">
							<button
								class="rounded-lg bg-red-500 p-2 text-white"
								on:click={() => addTimeSlot(index)}>+</button
							>
							{#if index > 0 || slotIndex > 0}
								<button class="p-2 text-white" on:click={() => removeTimeSlot(index, slotIndex)}
									>🗑️</button
								>
							{/if}
						</div>
					</div>
				{/each}
			{/each}
		</div>
	</div>
</div>

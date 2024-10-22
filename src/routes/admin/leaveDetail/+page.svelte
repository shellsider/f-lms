<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import NavBarAdminPage from "../../../Sections/AdminPageSections/AdminNavbar.svelte";

    // Variables to store leave details
    let leaveDetails = {
        "adjusted_to": {
            "28-09-2024": {
                "10-11": "Savneet",
                "9-10": "Meenakshi"
            },
            "29-09-2024": {
                "12:30-1:30": "Deepali"
            },
            "30-09-2024": {
                "2:30-3:30": "Sandhu",
                "8-9": "Meenakshi"
            }
        },
        "applied_on": "24-09-2024",
        "from_date": "26-09-2024",
        "half": null,
        "leave_id": "d4d0ed84-f423-4c78-8ae7-0dd5871fe54e",
        "leave_type": "CL",
        "no_of_days": "3",
        "reason_for_leave": "Sick",
        "status": "approved",
        "to_date": "28-09-2024",
        "username": "bobby1234"
    };

    // Example of receiving data passed via query params (assuming the button sent query data)
    onMount(() => {
        const query = $page.url.searchParams;
        const leaveId = query.get('leave_id'); // Retrieve leave_id or other data
        // Fetch leave details based on the ID if needed (currently static in this example)
    });
</script>

<main class="min-h-screen flex flex-col overflow-hidden bg-[#1D3247]">
    <section id="nav-section">
        <NavBarAdminPage />
      </section>
    <section class="flex justify-center items-center p-8 bg-[#1D3247]">
        <div class="bg-[#330D52] text-white shadow-md rounded-lg p-6 w-full max-w-4xl">
            <h1 class="text-2xl  font-bold mb-4">Leave Details</h1>

            <!-- Display Leave Details -->
            <div class="mb-4">
                <p><strong>Username:</strong> {leaveDetails.username}</p>
                <p><strong>Leave Type:</strong> {leaveDetails.leave_type}</p>
                <p><strong>Reason for Leave:</strong> {leaveDetails.reason_for_leave}</p>
                <p><strong>No. of Days:</strong> {leaveDetails.no_of_days}</p>
                <p><strong>From Date:</strong> {leaveDetails.from_date}</p>
                <p><strong>To Date:</strong> {leaveDetails.to_date}</p>
                <p><strong>Applied On:</strong> {leaveDetails.applied_on}</p>
                <p><strong>Half Day:</strong> {leaveDetails.half ? leaveDetails.half : 'None'}</p>
                <br>
                <p><strong>Status:</strong> {leaveDetails.status}</p>
            </div>

            <!-- Display Adjusted To Details -->
            <div class="mb-4">
                <h2 class="text-xl font-semibold mb-2">Adjusted To:</h2>
                {#each Object.entries(leaveDetails.adjusted_to) as [date, shifts]}
                    <p class="font-bold">{date}:</p>
                    <ul class="ml-4">
                        {#each Object.entries(shifts) as [time, name]}
                            <li>{time}: {name}</li>
                        {/each}
                    </ul>
                {/each}
            </div>
        </div>
    </section>
</main>

<style>
    :global(body) {
        margin: 0;
        font-family: 'Inter', sans-serif;
        background-color: #1D3247;
    }
</style>

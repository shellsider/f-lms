<script>
    let pendingLeaves = [
      {
        id: 1,
        username: "john_doe",
        appliedOn: "10-10-2024",
        from: "11-10-2024",
        to: "15-10-2024",
        typeOfLeave: "Casual Leave"
      },
      // You can add more pending leave data here
    ];
  
    function viewDetails(leaveId) {
      // Handle the view details logic here, you can route to the leave details page
      console.log(`View details for leave ID: ${leaveId}`);
    }

    
    import NavBarAdminPage from "../../../Sections/AdminPageSections/AdminNavbar.svelte";
</script>
 <main> 
    <section id="nav-section">
          <NavBarAdminPage />
    </section>
    
    <div class="table-container p-8 bg-lightPurple rounded-lg shadow-lg">
      <h2 class="text-center text-2xl text-gold mb-4">Pending Leaves</h2>
  
      <table class="table-auto w-full bg-darkPurple text-gold">
        <thead class="bg-lightPurple">
          <tr>
            <th class="p-2">S.no</th>
            <th class="p-2">Username</th>
            <th class="p-2">Applied On</th>
            <th class="p-2">From</th>
            <th class="p-2">To</th>
            <th class="p-2">Type of leave</th>
            <th class="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {#each pendingLeaves as leave, index}
            <tr class="border-b border-darkBlue">
              <td class="p-2 text-center">{index + 1}</td>
              <td class="p-2 text-center">{leave.username}</td>
              <td class="p-2 text-center">{leave.appliedOn}</td>
              <td class="p-2 text-center">{leave.from}</td>
              <td class="p-2 text-center">{leave.to}</td>
              <td class="p-2 text-center">{leave.typeOfLeave}</td>
              <td class="p-2 text-center">
                <button 
                  class="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-700"
                  on:click={() => viewDetails(leave.id)}
                >
                  View Details
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
</main>
  
  <style>
    :global(body) {
      margin: 0;
      font-family: Arial, sans-serif;
      background-color: #1D3247; /* Dark Blue Background */
    }
    .bg-darkBlue {
      background-color: #1D3247; /* Dark Blue */
    }
    .bg-lightPurple {
      background-color: #4b4175; /* Light Purple */
    }
    .bg-darkPurple {
      background-color: #3b3360; /* Dark Purple */
    }
    .text-gold {
      color: #FFD700; /* Gold Text */
    }
    .table-container {
      max-width: 80%;
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px;
    }
  </style>
  
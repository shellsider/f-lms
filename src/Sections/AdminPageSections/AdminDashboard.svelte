<script>
    let pendingLeaves = 10; // Sample data for Pending Leaves
    let usersOnLeave = 10;  // Sample data for Users on Leave
  
    // Sample table data
    let usersOnLeaveToday = [
      { fullname: 'ABCD Singh', upto: '20-10-2024' },
      // Add more users as needed
    ];
  </script>
  
  <div class="container mx-auto p-6 text-white">
    <!-- Top Info Boxes -->
    <div class="flex justify-center space-x-10 mb-20">
      <div class="box flex flex-col items-center justify-center">
        <h2 class="text-lg">Pending Leaves</h2>
        <p class="text-2xl font-semibold">({pendingLeaves})</p>
      </div>
  
      <div class="box flex flex-col items-center justify-center">
        <h2 class="text-lg">Users on Leave</h2>
        <p class="text-2xl font-semibold">({usersOnLeave})</p>
      </div>
    </div>
  
    <!-- Table Section -->
    <div>
      <h2 class="text-center text-xl mb-4">Users on Leave Today</h2>
      <table class="table-auto w-full text-center border-collapse border border-gray-500">
        <thead>
          <tr class="bg-[#462257] text-white">
            <th class="border border-gray-500 py-2">S.no</th>
            <th class="border border-gray-500 py-2">Fullname</th>
            <th class="border border-gray-500 py-2">Upto</th>
            <th class="border border-gray-500 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {#each usersOnLeaveToday as user, index}
            <tr class="bg-[#6A427F] text-white">
              <td class="border border-gray-500 py-2">{index + 1}</td>
              <td class="border border-gray-500 py-2">{user.fullname}</td>
              <td class="border border-gray-500 py-2">{user.upto}</td>
              <td class="border border-gray-500 py-2">
                <button class="bg-[#1D3247] text-white px-4 py-1 rounded hover:bg-[#3C5175]">
                  View Details
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
  
  <style>
    .container {
      max-width: 1200px;
    }
  
    .box {
      background-color: #330D52; /* Dark purple background */
      padding: 20px;
      border-radius: 10px;
      width: 180px;
      height: 100px;
    }
  
    table {
      background-color: #3C5175; /* Light purple background */
    }
  </style>
  
<script>
  import logoUrl from '$lib/HomePageAssets/logo.png';
  let textLg = 'Guru Tegh Bahadur Institute of Technology';
</script>

<div class="flex items-center justify-between p-4 shadow-md h-16" style="background-color: rgba(39, 55, 77, 0.87);">
  <!-- Left side: Logo -->
  <div class="flex items-center">
    <img src={logoUrl} alt="Logo" class="h-10" />

    <!-- Full name on larger screens and acronym on smaller screens -->
    <h1 class="ml-2 text-lg text-white font-medium text-gray-700 hidden md:block">
      {textLg}
    </h1>
    <h1 class="ml-2 text-lg text-white font-medium text-gray-700 block md:hidden">
      GTBIT
    </h1>
  </div>

  <!-- Right side: Text -->
  <div class="ml-auto">
    <h1 class="text-lg text-white font-medium text-gray-700">Leave Portal</h1>
  </div>
</div>

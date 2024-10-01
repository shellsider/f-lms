<script>
    import logoUrl from '$lib/HomePageAssets/logo.png';
    let email = '';
    let password = '';
</script>

<div class="flex items-center justify-center max-h-screen bg-gray-200" style="background: none;">
  <div class="customsize p-8 rounded-3xl shadow-lg w-full max-w-5xl text-center space-y-6" style="background-color: rgba(39, 55, 77, 0.34);">
    <!-- Logo -->
    <img src={logoUrl} alt="Logo" class="mx-auto w-32 sm:w-40 mb-6" />

    <!-- Input fields -->
    <div>
      <input 
        type="email" 
        placeholder="Email" 
        bind:value={email} 
        class="w-full px-8 py-3 text-base rounded-full bg-gray-500 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
      />
    </div>
    <div>
      <input 
        type="password" 
        placeholder="Password" 
        bind:value={password} 
        class="w-full px-8 py-3 text-base rounded-full bg-gray-500 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
      />
    </div>

    <!-- Login button -->
    <div>
      <button class="w-full px-8 py-3 text-base bg-gray-700 text-white rounded-full hover:bg-gray-800 transition focus:outline-none">
        LOGIN
      </button>
    </div>

    <!-- Admin Login link -->
    <div>
      <a href="#admin" class="text-gray-500 hover:text-gray-700 text-sm" style="text-color: rgba(255, 255, 255, 0.50);">Admin Login</a>
    </div>
  </div>
</div>

<style>
    .customsize{
        margin-left: 650px;
        margin-right: 650px;
        margin-top: 75px;
    }

    @media (max-width: 1325px) {
        .customsize{
            margin-left: 400px;
        margin-right: 400px;
        }
    }

    @media (max-width: 1250px) {
        .customsize{
            margin-left: 350px;
        margin-right: 350px;
        }
    }

    @media (max-width: 1140px) {
        .customsize{
            margin-left: 300px;
        margin-right: 300px;
        }
    }

    @media (max-width: 1046px) {
        .customsize{
            margin-left: 250px;
        margin-right: 250px;
        }
    }

    @media (max-width: 932px) {
        .customsize{
            margin-left: 200px;
        margin-right: 200px;
        }
    }

    @media (max-width: 932px) {
        .customsize{
            margin-left: 100px;
        margin-right: 100px;
        }
    }

    @media (max-width: 482px) {
        .customsize{
            margin-left: 25px;
        margin-right: 25px;
        margin-top: -35px;
        }
    }
</style>
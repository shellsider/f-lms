<script>
    import { goto } from '$app/navigation';
  import axiosInstance from '../../utils/axios.config.js';
  
  let email = '';
  let password = '';
  let errorMessage = '';

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/signin', new URLSearchParams({
        email,
        password
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.status === 200) {
        // Login successful
        // Redirect to the dashboard or home page
        await goto('/user/dashboard');
      } else {
        errorMessage = response.data.detail || 'An error occurred during login.';
      }
    } catch (error) {
      console.error('Error during login:', error);
      if (error.response && error.response.data && error.response.data.detail) {
        errorMessage = error.response.data.detail;
      } else {
        errorMessage = 'An error occurred during login.';
      }
    }
  };
</script>

<div class="flex justify-center items-center min-h-screen">
    <!-- Main container for the login form -->
    <div class="bg-[#2a194c] w-[500px] max-w-lg p-8 rounded-lg shadow-lg max-md:w-full -mt-[100px]">
        <h2 class="text-center text-3xl font-semibold text-gray-300 mb-8">
            Welcome
        </h2>

        <form class="space-y-6" on:submit|preventDefault={handleLogin}>
            <!-- Email Field -->
            <div>
                <label class="block text-gray-300 text-sm font-semibold mb-1" for="email">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    bind:value={email}
                    class="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffc4d1]"
                    placeholder="Example@gmail.com"
                    required
                />
            </div>

            <!-- Password Field -->
            <div>
                <label class="block text-gray-300 text-sm font-semibold mb-1" for="password">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    bind:value={password}
                    class="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffc4d1]"
                    placeholder="Password"
                    required
                />
            </div>

            <!-- Login Button -->
            <div>
                <button
                    type="submit"
                    class="w-full py-3 bg-gradient-to-r from-[#330d52] via-[#7a4abf] to-[#ffc4d1] text-gray-200 font-bold rounded-lg shadow-lg hover:opacity-90 transition duration-300"
                >
                    Login
                </button>
            </div>
        </form>

        <!-- Additional Links -->
        <div class="mt-4 text-center text-gray-400 text-sm">
            <a href="#" class="hover:underline">Admin Login</a> | 
            <a href="#" class="hover:underline">Forgot password?</a> | 
            <a href="#" class="hover:underline">Need Help?</a>
        </div>
    </div>
</div>

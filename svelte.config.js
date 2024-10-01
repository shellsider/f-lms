import adapter from 'svelte-adapter-static-digitalocean';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// Configure the adapter for Digital Ocean
		adapter: adapter({
			// Add any configuration options specific to the adapter if needed
		})
	}
};

export default config;

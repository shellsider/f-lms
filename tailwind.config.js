/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'custom-bg': '#9DB2BF', // Adding your custom background color
			},
		},
	},
	plugins: [],
};

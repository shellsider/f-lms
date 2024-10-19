// vite.config.js
import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import { sveltekit } from '@sveltejs/kit/vite';

// Load environment variables
dotenv.config();

export default defineConfig({
  plugins: [sveltekit()],
});

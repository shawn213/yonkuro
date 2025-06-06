import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
			base: process.env.BASE_PATH || '/yonkuro',
			relative: true
		},
		prerender: {
			handleHttpError: ({ status, path, referrer, referenceType }) => {
				// 只要不是 200，都忽略，不要 throw
				if (status === 404) return;
				throw new Error(`${status} ${path}`);
			}
		}
	}
};

export default config;

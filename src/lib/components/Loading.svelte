<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { menuStore } from '$stores/advancedGenericStore';

	onMount(() => {
		if (page.url.pathname !== `${base}/tools/work` && !$menuStore) {
			goto(`${base}/`, { replaceState: true });
		}
	});
</script>

<div class="bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40 bg-gray-900">
	<div class="overlay"></div>
</div>

<style>
	.overlay {
		background: gray;
		position: absolute;
		z-index: 999;
		opacity: 0.3;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>

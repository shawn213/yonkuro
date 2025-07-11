<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { menuStore } from '$stores/advancedGenericStore';
	import Loading from '$lib/components/Loading.svelte';

	const { children } = $props();
</script>

{#if !$menuStore && page.url.pathname !== `${base}/tools/work`}
	<Loading />
{/if}
{@render children()}

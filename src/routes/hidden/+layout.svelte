<script lang="ts">
	import { menuStore } from '$stores/menuStore';
	import Loading from '$lib/components/Loading.svelte';

	const { children } = $props();
</script>

{#if !$menuStore}
	<Loading />
{/if}
{@render children()}

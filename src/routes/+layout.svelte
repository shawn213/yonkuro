<script lang="ts">
	import '../app.css';
	import Menu from '$lib/Menu.svelte';
	import { Span } from 'flowbite-svelte';

	let { children } = $props();
</script>

<div class="relative">
	<Menu />
	{@render children()}
	<Span class="fixed right-3 bottom-1">{import.meta.env.VITE_VERSION}</Span>
</div>

<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, DarkMode, Span } from 'flowbite-svelte';
	import * as Icon from 'flowbite-svelte-icons';
	import { base } from '$app/paths';

	const menues = [
		{ href: `${base}/`, label: 'Home' },
		{ href: `${base}/about`, label: 'About' },
		{ href: `${base}/contact`, label: 'Contact' }
	];
</script>

<Navbar class="left-0 w-full px-2 py-0 dark:bg-gray-800" color="form">
	<NavBrand href="/">
		<img src="https://svelte.dev/favicon.png" class="mr-3 h-6 sm:h-9" alt="Svelte Logo" />
		<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
			選擇障礙
		</span>
	</NavBrand>
	<NavHamburger />
	<NavUl>
		{#each menues as { href, label }}
			<NavLi {href}>{label}</NavLi>
		{/each}
	</NavUl>
	<DarkMode class="text-lg">
		{#snippet lightIcon()}
			<Icon.ThumbsUpSolid color="white" />
		{/snippet}
		{#snippet darkIcon()}
			<Icon.ThumbsDownSolid color="green" />
		{/snippet}
	</DarkMode>
</Navbar>

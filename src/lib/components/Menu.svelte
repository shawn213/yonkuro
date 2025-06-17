<script lang="ts">
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		DarkMode,
		Dropdown,
		DropdownItem
	} from 'flowbite-svelte';
	import * as Icon from 'flowbite-svelte-icons';
	import { base } from '$app/paths';

	const menues = [
		{ name: 'Home', href: `${base}/` },
		{ name: 'About', href: `${base}/about` },
		{
			name: 'Tools',
			childs: [
				{ name: 'Work', href: `${base}/tools/work`, icon: 'HammerOutline' },
				{ name: 'Encryption', href: `${base}/tools/encryption`, icon: 'LockOutline' }
			]
		}
	];
</script>

<Navbar class="left-0 w-full px-2 py-0 dark:bg-gray-800" color="form">
	<NavBrand href="/">
		<img src="https://svelte.dev/favicon.png" class="mr-3 h-6 sm:h-9" alt="Svelte Logo" />
		<!-- <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
			選擇障礙
		</span> -->
	</NavBrand>
	<NavUl>
		{#each menues as menu}
			{#if menu.childs}
				<NavLi class="cursor-pointer">
					{menu.name}<Icon.ChevronDownOutline
						class="text-primary-800 ms-2 inline h-6 w-6 dark:text-white" />
				</NavLi>
				<Dropdown simple>
					{#each menu.childs as child}
						<DropdownItem href={child.href} class="flex items-center gap-2">
							<svelte:component
								this={child.icon ? Icon[child.icon] : Icon.AppleSolid} />{child.name}
						</DropdownItem>
					{/each}
				</Dropdown>
			{:else}
				<NavLi href={menu.href}>{menu.name}</NavLi>
			{/if}
		{/each}
	</NavUl>
	<div class="flex items-center md:order-2">
		<DarkMode class="text-lg">
			{#snippet lightIcon()}
				<Icon.ThumbsUpSolid color="white" />
			{/snippet}
			{#snippet darkIcon()}
				<Icon.ThumbsDownSolid color="green" />
			{/snippet}
		</DarkMode>
		<NavHamburger />
	</div>
</Navbar>

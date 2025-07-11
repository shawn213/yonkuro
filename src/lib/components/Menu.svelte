<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		DarkMode,
		Dropdown,
		DropdownItem,
		Indicator
	} from 'flowbite-svelte';
	import * as Icon from 'flowbite-svelte-icons';
	import { base } from '$app/paths';
	import { browser } from '$app/environment';
	import { menuStore } from '$stores/advancedGenericStore';

	let timer;

	// 長按處理函數
	const handleTouchStart = () => {
		timer = setTimeout(() => {
			menuStore.update((value) => !value);
			timer = null;
		}, 5000);
	};

	const handleTouchEnd = () => {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	};

	const handleTouchMove = () => {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	};

	// 按鍵處理
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'F4') {
			menuStore.update((value) => !value);
		}
	};

	onMount(() => {
		if (browser) {
			// 鍵盤事件監聽
			window.addEventListener('keydown', handleKeyDown);
		}
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('keydown', handleKeyDown);
		}
	});

	// 菜單項目定義
	const menues = [
		{ name: 'Home', href: `${base}/`, show: true },
		{ name: 'About', href: `${base}/about`, show: true },
		{
			name: 'Tools',
			show: true,
			childs: [
				{ name: 'Work', href: `${base}/tools/work`, icon: 'ClockOutline', show: true },
				{ name: 'Encryption', href: `${base}/tools/encryption`, icon: 'LockOutline' },
				{ name: 'Yaml', href: `${base}/tools/yaml`, icon: 'LaptopCodeOutline' },
				{ name: 'Json', href: `${base}/tools/json`, icon: 'LaptopCodeOutline' },
				{ name: 'MyBatis', href: `${base}/tools/mybatis`, icon: 'LaptopCodeOutline' },
				{ name: 'Lottery', href: `${base}/tools/lottery` },
				{ name: 'Prize', href: `${base}/tools/prize` }
			]
		}
	];
</script>

<Navbar
	class="bg-primary-500 left-0 w-full px-2 py-0 dark:bg-gray-800"
	color="form"
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
	ontouchmove={handleTouchMove}>
	<NavBrand href="{base}/">
		<img src="https://svelte.dev/favicon.png" class="mr-3 h-6 sm:h-9" alt="Svelte Logo" />
		{#if $menuStore}
			<Indicator color="red" />
		{/if}
		<!-- <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            選擇障礙
        </span> -->
	</NavBrand>
	<NavUl>
		{#each menues as menu}
			{#if menu.show || $menuStore}
				{#if menu.childs}
					<NavLi class="cursor-pointer">
						{menu.name}<Icon.ChevronDownOutline
							class="text-primary-800 ms-2 inline h-6 w-6 dark:text-white" />
					</NavLi>
					<Dropdown simple>
						{#each menu.childs as child}
							{#if child.show || $menuStore}
								<DropdownItem href={child.href} class="flex items-center gap-2">
									<svelte:component
										this={child.icon ? Icon[child.icon] : Icon.AppleSolid} />{child.name}
								</DropdownItem>
							{/if}
						{/each}
					</Dropdown>
				{:else}
					<NavLi href={menu.href}>{menu.name}</NavLi>
				{/if}
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

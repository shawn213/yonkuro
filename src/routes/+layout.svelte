<script lang="ts">
	import '../app.css';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from "flowbite-svelte";
	import { base } from '$app/paths';

	let { children } = $props();
</script>

<div class="w-full left-0 fixed z-40 block">
	<Navbar class="px-2 py-1 w-full left-0 border-b flex flex-wrap justify-between items-center">
	  <NavBrand href="{base}/">
		<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
	  </NavBrand>
	  <NavHamburger />
	  <NavUl>
		<NavLi href="{base}/">Home</NavLi>
		<NavLi href="{base}/about">About</NavLi>
	  </NavUl>
	</Navbar>
	{@render children()}
</div>

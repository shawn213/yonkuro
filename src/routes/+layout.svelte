<script lang="ts">
	import '../app.css';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from "flowbite-svelte";

	let { children } = $props();
</script>

<div class="w-full left-0 fixed z-40 block">
	<Navbar class="px-2 py-1 w-full left-0 border-b flex flex-wrap justify-between items-center">
	  <NavBrand href="/">
		<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
	  </NavBrand>
	  <NavHamburger />
	  <NavUl>
		<NavLi href="/">Home</NavLi>
		<NavLi href="/about">About</NavLi>
	  </NavUl>
	</Navbar>
	{@render children()}
</div>

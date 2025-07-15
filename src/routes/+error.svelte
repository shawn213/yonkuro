<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { P } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/state';

	let timer: any;

	onMount(() => {
		if (page.status === 404) {
			timer = setTimeout(() => {
				goto(`${base}/`, { replaceState: true });
			}, 1000); // 2 秒後自動跳轉
		}
	});

	onDestroy(() => {
		if (timer) {
			clearTimeout(timer);
		}
	});
</script>

<P class="text-2xl">錯誤碼：{page.status}</P>
<P>錯誤訊息：{page.error?.message}...1秒後自動跳轉</P>

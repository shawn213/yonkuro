<script>
	import QR from '@svelte-put/qr/svg/QR.svelte';
	import { page } from '$app/state';

	let isMobile = false;
	// 檢查是否為移動設備
	if (typeof window !== 'undefined') {
		isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);
	}
</script>

<div class="flex flex-row" class:justify-center={isMobile}>
	<div class="h-80 w-80 bg-white md:h-96 md:w-96">
		<QR
			data={page.url.origin + page.url.pathname}
			logo="https://svelte.dev/favicon.png"
			moduleFill="green"
			anchorOuterFill="green"
			anchorInnerFill="green"
			shape="circle" />
	</div>
</div>

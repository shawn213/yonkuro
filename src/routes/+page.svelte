<script>
	import QR from '@svelte-put/qr/svg/QR.svelte';
	import { page } from '$app/state';
</script>

<div class="h-80 w-80 bg-white md:h-96 md:w-96">
	<QR
		data={page.url.origin + page.url.pathname}
		logo="https://svelte.dev/favicon.png"
		moduleFill="green"
		anchorOuterFill="green"
		anchorInnerFill="green"
		shape="circle" />
</div>

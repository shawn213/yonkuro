<script>
	import QR from '@svelte-put/qr/svg/QR.svelte';
	import { page } from '$app/state';
</script>

<div class="m-5 h-96 w-96 bg-white">
	<QR
		data={page.url.origin + page.url.pathname}
		logo="https://svelte.dev/favicon.png"
		moduleFill="green"
		anchorOuterFill="green"
		anchorInnerFill="green"
		shape="circle" />
</div>

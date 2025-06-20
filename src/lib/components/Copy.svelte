<script lang="ts">
	import { FileCloneOutline, FileCheckOutline } from 'flowbite-svelte-icons';

	export let text: string = '';
	let Icon = FileCloneOutline;

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(text);
			Icon = FileCheckOutline;
			setTimeout(() => {
				Icon = FileCloneOutline;
			}, 1000);
		} catch (error) {
			console.error('Failed to copy text: ', error);
		}
	};
</script>

<svelte:component this={Icon} onclick={copyToClipboard} />

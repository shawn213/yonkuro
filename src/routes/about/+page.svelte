<script lang="ts">
	import { getSpreadsheetValues } from '$lib/utils/googleSheets';
	import { onMount } from 'svelte';

	let holidays: Record<string, string>[] = [];

	onMount(async () => {
		const data = await getSpreadsheetValues('1NlEFP8qKj9YiE8EJ_8ipPN04mhkdjUL4OABP4LO7gPo', 'now');
		console.log(data);
		holidays = data;
	});
</script>

<ul>
	{#each holidays as record}
		<li>{record.date}: {record.name}</li>
	{/each}
</ul>

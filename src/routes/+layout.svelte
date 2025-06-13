<script lang="ts">
	import '../app.css';
	import Menu from '$lib/components/Menu.svelte';
	import { Span } from 'flowbite-svelte';
	import { getSpreadsheetValues } from '$lib/utils/googleSheets';
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';

	let holidays: Record<string, string>[] = [];

	const getHolidays = async () => {
		const data = await getSpreadsheetValues('1NlEFP8qKj9YiE8EJ_8ipPN04mhkdjUL4OABP4LO7gPo', 'now');
		holidays = data;
		localStorage.setItem(
			'holidays',
			JSON.stringify({ days: holidays, date: dayjs().format('YYYY-MM') })
		);
		return holidays;
	};

	onMount(async () => {
		const holidays = localStorage.getItem('holidays');
		if (holidays) {
			const parsedHolidays = JSON.parse(holidays);
			if (parsedHolidays.date !== dayjs().format('YYYY-MM')) {
				await getHolidays();
				return;
			}
		} else {
			await getHolidays();
		}
	});

	let { children } = $props();
</script>

<div class="relative">
	<Menu />
	{@render children()}
	<Span class="fixed right-3 bottom-1">{import.meta.env.VITE_VERSION}</Span>
</div>

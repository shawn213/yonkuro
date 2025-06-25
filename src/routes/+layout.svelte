<script lang="ts">
	import '../app.css';
	import Menu from '$lib/components/Menu.svelte';
	import { Span } from 'flowbite-svelte';
	import { getSpreadsheetValues } from '$lib/utils/googleSheets';
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import localforage from 'localforage';

	let holidays: Record<string, string>[] = [];

	const getHolidays = async () => {
		const data = await getSpreadsheetValues(import.meta.env.VITE_HOLIDAY_SHEET, 'now');
		holidays = data;
		localforage.setItem('holidays', { days: holidays, date: dayjs().format('YYYY-MM') });
		location.reload();
		return holidays;
	};

	onMount(async () => {
		const holidays = await localforage.getItem('holidays');
		if (holidays) {
			const parsedHolidays = holidays;
			if (parsedHolidays['date'] !== dayjs().format('YYYY-MM')) {
				await getHolidays();
				return;
			}
		} else {
			await getHolidays();
		}
	});

	let { children } = $props();
</script>

<svelte:head>
	<title>toriko - {page.url.pathname.replace(base, '')}</title>
</svelte:head>
<div class="relative">
	<Menu />
	<div class="p-2">
		{@render children()}
	</div>
	<Span class="fixed right-3 bottom-1">{import.meta.env.VITE_VERSION}</Span>
</div>

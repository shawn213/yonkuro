<script lang="ts">
	import '../app.css';
	import Menu from '$lib/components/Menu.svelte';
	import { Span } from 'flowbite-svelte';
	import { getSpreadsheetValues } from '$lib/utils/googleSheets';
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { holidayStore, type Holiday } from '$stores/advancedGenericStore';
	import localforage from 'localforage';

	const getHolidays = async () => {
		const data = await getSpreadsheetValues(import.meta.env.VITE_HOLIDAY_SHEET, 'now');
		localforage.setItem('holidays', { days: data, date: dayjs().format('YYYY-MM') });
		holidayStore.set({ days: data, date: dayjs().format('YYYY-MM') });
		return data;
	};

	onMount(() => {
		localforage.getItem('holidays').then((holidays: Holiday | null) => {
			if (holidays) {
				const parsedHolidays = holidays;
				if (parsedHolidays.date !== dayjs().format('YYYY-MM')) {
					getHolidays();
					return;
				} else {
					holidayStore.set(parsedHolidays);
				}
			} else {
				getHolidays();
			}
		});
	});

	const { children } = $props();
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

<style>
	:global(textarea) {
		font-family:
			'Noto Sans TC', 'Open Sans', 'Roboto', 'PingFang TC', 'Microsoft JhengHei', 'Helvetica Neue',
			Arial, sans-serif;
	}
</style>

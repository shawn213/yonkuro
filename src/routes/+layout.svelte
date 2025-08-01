<script lang="ts">
	import '../app.css';
	import Menu from '$lib/components/Menu.svelte';
	import { Span, Alert } from 'flowbite-svelte';
	import { getSpreadsheetValues } from '$lib/utils/googleSheets';
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { holidayStore, type Holiday } from '$stores/holidayStore';
	import { clearUnnamedData, holidayDataStore } from '$stores/localforageStore';
	import { alertStore } from '$stores/alertStore';

	const closeAlert = () => {
		alertStore.set(null);
	};

	const getHolidays = async () => {
		const data = await getSpreadsheetValues(import.meta.env.VITE_HOLIDAY_SHEET, 'now');
		holidayDataStore.setItem('holidays', { days: data, date: dayjs().format('YYYY-MM') });
		holidayStore.set({ days: data, date: dayjs().format('YYYY-MM') });
		return data;
	};

	onMount(async () => {
		await clearUnnamedData();
		holidayDataStore.getItem('holidays').then((holidays: Holiday | null) => {
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
		alertStore.subscribe((alert) => {
			if (alert) {
				setTimeout(() => {
					alertStore.set(null);
				}, alert.timeout || 3000);
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
	{#if $alertStore && $alertStore.message}
		<Alert
			class="fixed top-20 z-50 w-full"
			color={$alertStore.color || 'blue'}
			dismissable
			onclick={closeAlert}>
			<div class="flex items-center justify-center">
				<Span>{$alertStore.message}</Span>
			</div>
		</Alert>
	{/if}
	<div class="p-2">
		{@render children()}
	</div>
	<Span class="fixed right-3 bottom-1">{import.meta.env.VITE_VERSION}</Span>
</div>

<style>
	:global(textarea, input, label) {
		font-family:
			Consolas, 'Noto Sans TC', 'Open Sans', 'Roboto', 'PingFang TC', 'Microsoft JhengHei',
			'Helvetica Neue', Arial, sans-serif;
	}
</style>

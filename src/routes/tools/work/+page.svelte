<script lang="ts">
	import {
		Label,
		Input,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Img
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';
	import _ from 'lodash';

	let startMonth = dayjs().format('YYYYMM');
	let endMonth = dayjs().format('YYYYMM');
	let manDay = 1;
	let totalWorkDay = 0;
	let totalPercentDay = 0;
	let totalPercentTime = 0;
	$: items = [];
	let holidays = { days: [] };

	onMount(() => {
		const holidays = localStorage.getItem('holidays');
		if (!holidays) {
			fetch('/holidays.json')
				.then((response) => response.json())
				.then((data) => {
					localStorage.setItem('holidays', JSON.stringify(data));
				})
				.catch((error) => console.error('Error fetching holidays:', error));
		}
	});

	const isWorkDay = (date: any) => {
		return (
			[1, 2, 3, 4, 5].includes(date.day()) &&
			!holidays.days.some((h: any) => h.date === date.format('YYYY-MM-DD'))
		);
	};

	$: {
		items = [];
		let startDay = dayjs(startMonth, 'YYYYMM').startOf('month');
		const endDay = dayjs(endMonth, 'YYYYMM').endOf('month').startOf('date');
		let preMonth = startDay.month();
		let idx = 0;
		let workDay = 0;
		let percentDay = 0;
		let percentTime = 0;
		do {
			if (startDay.month() !== preMonth) {
				percentDay = Math.round(workDay * manDay * 10) / 10;
				percentTime = Math.round(workDay * 8 * manDay * 10) / 10;
				items[idx] = {
					month: startDay.add(-1, 'month').format('MMM'),
					workDay,
					percentDay,
					percentTime
				};
				preMonth = startDay.month();
				console.log(preMonth);
				idx += 1;
				workDay = 0;
				percentDay = 0;
				percentTime = 0;
			}
			workDay += isWorkDay(startDay) ? 1 : 0;
			startDay = startDay.add(1, 'days');
		} while (endDay.diff(startDay, 'days') >= 0);
		percentDay = Math.round(workDay * manDay * 10) / 10;
		percentTime = Math.round(workDay * 8 * manDay * 10) / 10;
		items[idx] = {
			month: startDay.add(-1, 'month').format('MMM'),
			workDay,
			percentDay,
			percentTime
		};
		totalWorkDay = _.sumBy(items, 'workDay');
		totalPercentDay = _.sumBy(items, 'percentDay');
		totalPercentTime = _.sumBy(items, 'percentTime');
	}
</script>

<div class="block">
	<div class="mb-4">
		<Label class="mb-1">開始月份</Label>
		<Input bind:value={startMonth} />
	</div>
	<div class="mb-4">
		<Label class="mb-1">結束月份</Label>
		<Input bind:value={endMonth} />
	</div>
	<div class="mb-4">
		<Label class="mb-1">man/month</Label>
		<Input bind:value={manDay} />
	</div>
	{#if items.length > 0}
		<Table>
			<TableHead>
				<TableHeadCell>Month</TableHeadCell>
				{#each items as item}
					<TableHeadCell>{item.month}</TableHeadCell>
				{/each}
				<TableHeadCell padding="px-6">總共</TableHeadCell>
			</TableHead>
			<TableBody>
				<TableBodyRow>
					<TableBodyCell>總天數</TableBodyCell>
					{#each items as item}
						<TableBodyCell>{item.workDay}</TableBodyCell>
					{/each}
					<TableBodyCell>{totalWorkDay}</TableBodyCell>
				</TableBodyRow>
				<TableBodyRow>
					<TableBodyCell>換算天數</TableBodyCell>
					{#each items as item}
						<TableBodyCell>{item.percentDay}</TableBodyCell>
					{/each}
					<TableBodyCell>{totalPercentDay}</TableBodyCell>
				</TableBodyRow>
				<TableBodyRow>
					<TableBodyCell>換算工時</TableBodyCell>
					{#each items as item}
						<TableBodyCell>{item.percentTime}</TableBodyCell>
					{/each}
					<TableBodyCell>{totalPercentTime}</TableBodyCell>
				</TableBodyRow>
			</TableBody>
		</Table>
	{/if}
</div>

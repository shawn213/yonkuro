<script>
	import { onMount } from 'svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Label,
		Span,
		Img
	} from 'flowbite-svelte';
	import dayjs from 'dayjs';
	import { stepDataStore } from '$stores/localforageStore';
	import { slide } from 'svelte/transition';
	import _ from 'lodash';
	import { getSpreadsheetValues } from '$lib/utils/googleSheets';

	let list = $state([]);
	let openRow = $state();

	// 計算從 7 月 1 日到昨天的總天數
	const startDate = dayjs('2025-07-01');
	const yesterday = dayjs();
	const totalDays = yesterday.diff(startDate, 'day') + 1;

	// 計算目標步數和團隊步數
	const targetSteps = Math.min(totalDays, 20) * 5000;
	const teamSteps = targetSteps + targetSteps * 0.25;

	// 格式化百分比
	const formatPercentage = (value) => {
		if (value === Infinity || isNaN(value)) {
			return 'N/A';
		}
		return (value * 100).toFixed(2) + '%';
	};

	const getColor = (achievementRate) => {
		if (achievementRate >= 1) {
			return 'text-green-400';
		} else if (achievementRate > 0.9 && achievementRate < 1) {
			return 'text-orange-400';
		} else if (achievementRate <= 0.9) {
			return 'text-red-500';
		}
		return '';
	};

	const getMissingStepsStyle = (missingSteps) => {
		if (missingSteps > 5000) {
			return 'text-red-500';
		} else if (missingSteps > 0) {
			return 'text-yellow-300';
		}
		return '';
	};

	const getEncouragement = (missingSteps) => {
		if (missingSteps > 5000) {
			const missingStepsDays = Math.ceil(missingSteps / 5000);
			return `還差 ${missingStepsDays} 天的份量，要達標 20 天你絕對不是九成之外的那人！快點補上！`;
		} else if (missingSteps > 0) {
			return '只差今天的份量！加油！';
		}
		return '';
	};

	const toggleRow = (i, missingSteps) => {
		const missingStepsDays = Math.ceil(missingSteps / 5000);
		if (missingStepsDays >= 1 && totalDays > 20) {
			openRow = openRow === i ? null : i;
		}
	};

	// 添加千分號格式化函數
	const formatNumber = (num) => {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	};

	const loadData = async () => {
		const today = dayjs().format('YYYY-MM-DD HH:mm');

		// 如果資料不存在或不是最新的，則重新查詢
		const spreadsheetId = import.meta.env.VITE_STEP_SHEET; // 替換為您的 Google Sheet ID
		const sheetName = 'step'; // 替換為您的 Sheet 名稱
		const googleSheetData = await getSpreadsheetValues(spreadsheetId, sheetName);

		if (googleSheetData.length > 0) {
			// 將資料儲存到 stepDataStore
			await stepDataStore.setItem('stepData', {
				date: today,
				data: googleSheetData
			});
			list = _.sortBy(googleSheetData, (item) => parseInt(item.total, 10));
		}
	};

	onMount(async () => {
		const storedData = await stepDataStore.getItem('stepData');
		if (storedData && storedData.date === dayjs().format('YYYY-MM-DD HH:mm')) {
			list = _.sortBy(storedData.data, (item) => parseInt(item.total, 10));
		} else {
			await loadData();
		}
	});
</script>

<div class="mb-2 flex items-center gap-6">
	<Label>活動開始第 {totalDays} 天</Label>
	<Label>目標步數: {formatNumber(targetSteps)}</Label>
	<Label>團隊步數: {formatNumber(teamSteps)}</Label>
</div>

<Table hoverable={true} striped={true}>
	<TableHead>
		<TableHeadCell>名字</TableHeadCell>
		<TableHeadCell>總步數</TableHeadCell>
		<TableHeadCell class="w-40">尚缺步數</TableHeadCell>
		<TableHeadCell>個人達成率</TableHeadCell>
		<TableHeadCell>團隊達成率</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each list as item, i}
			{@const targetAchievementRate = item.total / targetSteps}
			{@const teamAchievementRate = item.total / teamSteps}
			{@const targetColorClass = getColor(targetAchievementRate)}
			{@const teamColorClass = getColor(teamAchievementRate)}
			{@const missingSteps = Math.max(0, targetSteps - item.total)}
			{@const missingStepsStyle = getMissingStepsStyle(missingSteps)}
			{@const encouragement = getEncouragement(missingSteps)}
			<TableBodyRow onclick={() => toggleRow(i, missingSteps)}>
				<TableBodyCell>{item.name}</TableBodyCell>
				<TableBodyCell>{formatNumber(item.total)}</TableBodyCell>
				<TableBodyCell class={missingStepsStyle}>
					<div class="block">
						{missingSteps}
						{encouragement}
					</div>
				</TableBodyCell>
				<TableBodyCell class={targetColorClass}>
					{formatPercentage(targetAchievementRate)}
				</TableBodyCell>
				<TableBodyCell class={teamColorClass}>
					{formatPercentage(teamAchievementRate)}
				</TableBodyCell>
			</TableBodyRow>
			{#if openRow === i}
				<TableBodyRow>
					<TableBodyCell colspan={5} class="p-0">
						<div
							class="flex justify-center px-2 py-3"
							transition:slide={{ duration: 300, axis: 'y' }}>
							<Img src="https://i.meee.com.tw/DzMo8qC.png" />
						</div>
					</TableBodyCell>
				</TableBodyRow>
			{/if}
		{/each}
	</TableBody>
</Table>
<Span class="fixed right-3">以上數據為人工更新，因此每天只會更新一次</Span>

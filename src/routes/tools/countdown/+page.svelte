<script lang="ts">
	import { Input, Card, Span, Label } from 'flowbite-svelte';
	import { readable } from 'svelte/store';
	import dayjs from 'dayjs';

	let targetDate = dayjs().format('YYYY-MM-DDTHH:mm');

	// 建立一個會每秒更新一次的 readable store
	const time = readable(dayjs(), function start(set) {
		// 初始設定當前時間
		set(dayjs());

		// 建立一個精確的定時器
		const interval = setInterval(() => {
			set(dayjs());
		}, 1000);

		// 當組件被銷毀時清理定時器
		return function stop() {
			clearInterval(interval);
		};
	});

	// 計算剩餘時間的衍生值
	$: remainingTime = calculateRemainingTime($time, targetDate);

	// 計算剩餘時間的函數
	function calculateRemainingTime(currentTime, targetTime) {
		const target = dayjs(targetTime);
		const distance = target.diff(currentTime);

		if (distance < 0) {
			return {
				months: 0,
				days: 0,
				hours: 0,
				minutes: 0,
				seconds: 0
			};
		}

		// 計算總天數
		const totalDays = Math.floor(distance / (1000 * 60 * 60 * 24));

		// 計算月份 (約以 30 天為一個月)
		const months = Math.floor(totalDays / 30);

		// 計算剩餘天數 (總天數減去已經計算為月份的天數)
		const remainingDays = totalDays % 30;

		return {
			months: months,
			days: remainingDays,
			hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
			minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
			seconds: Math.floor((distance % (1000 * 60)) / 1000)
		};
	}
</script>

<div class="container mx-auto p-4">
	<Card class="mx-auto max-w-4xl p-2">
		<h2 class="mb-4 text-center text-2xl font-bold">倒數計時器</h2>

		<div class="mb-6">
			<Label>選擇目標日期和時間</Label>
			<Input type="datetime-local" bind:value={targetDate} />
		</div>

		<div
			class="grid gap-4 text-center"
			class:grid-cols-5={remainingTime.months > 0 && remainingTime.days > 0}
			class:grid-cols-4={!remainingTime.months || !remainingTime.days}>
			{#if remainingTime.months > 0}
				<div class="rounded-lg p-4">
					<Span class="block text-4xl">{remainingTime.months}</Span>
					<Span class="text-sm">月</Span>
				</div>
			{/if}

			{#if remainingTime.days > 0 || remainingTime.months > 0}
				<div class="rounded-lg p-4">
					<Span class="block text-4xl">{remainingTime.days}</Span>
					<Span class="text-sm">天</Span>
				</div>
			{/if}

			<div class="rounded-lg p-4">
				<Span class="block text-4xl">{remainingTime.hours}</Span>
				<Span class="text-sm">小時</Span>
			</div>
			<div class="rounded-lg p-4">
				<Span class="block text-4xl">{remainingTime.minutes}</Span>
				<Span class="text-sm">分鐘</Span>
			</div>
			<div class="rounded-lg p-4">
				<Span class="block text-4xl">{remainingTime.seconds}</Span>
				<Span class="text-sm">秒</Span>
			</div>
		</div>
	</Card>
</div>

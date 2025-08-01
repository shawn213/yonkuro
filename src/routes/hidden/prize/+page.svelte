<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Button, Label, Input, Textarea } from 'flowbite-svelte';
	import _ from 'lodash';
	import PrizeWheel from '$lib/components/PrizeWheel.svelte';

	const rows = 10;
	// 獎項列表 - 可以自由增減獎項數量
	let prizes = ['獎項A', '獎項B', '獎項C', '獎項D'];

	let turn = false;

	// 自定義轉盤設置
	let spinRevolutions = 5; // 轉動圈數
	let spinDuration = 4000; // 轉動時間，單位為毫秒
	let lastPrize = ''; // 記錄最後一次抽中的獎項
	let prize = ''; // 當前獎項

	onDestroy(() => {
		turn = false; // 清理轉盤狀態
	});

	// 增加旋轉圈數
	function increaseRevolutions() {
		spinRevolutions++;
	}

	// 減少旋轉圈數
	function decreaseRevolutions() {
		if (spinRevolutions > 1) {
			spinRevolutions--;
		}
	}

	// 增加旋轉時間
	function increaseDuration() {
		spinDuration += 1000; // 增加1秒
	}

	// 減少旋轉時間
	function decreaseDuration() {
		if (spinDuration > 1000) {
			spinDuration -= 1000; // 減少1秒
		}
	}

	// 處理轉盤結果事件 - Svelte 5 方式
	const handlePrizeResult = (resultData) => {
		lastPrize = resultData.prize;
		prizes = _.without(prizes, lastPrize); // 移除已抽中的獎項
		turn = false; // 停止轉盤
	};

	$: if (prize.length > 2) {
		prizes = prize.split(/[\r\n,;]+/).filter((item) => item.trim() !== '');
	}
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
	<div class="flex flex-col gap-4">
		<Label class="mb-2">中獎: {lastPrize}</Label>
		<PrizeWheel
			{prizes}
			{spinDuration}
			{spinRevolutions}
			onResultChange={handlePrizeResult}
			{turn} />
	</div>
	<div class="col-span-2 flex flex-col gap-4">
		<div class="grid grid-cols-1 items-center gap-2 md:grid-cols-2">
			<div class="flex items-center gap-2">
				<Label class="text-nowrap">轉動時間 (毫秒):</Label>
				<Input type="number" bind:value={spinDuration} min="1000" class="text-right" />
				<Button onclick={increaseDuration}>+</Button>
				<Button onclick={decreaseDuration} disabled={spinDuration <= 1000}>-</Button>
			</div>
			<div class="flex items-center gap-2">
				<Label class="text-nowrap">轉動圈數:</Label>
				<Input type="number" bind:value={spinRevolutions} min="1" class="text-right" />
				<Button onclick={increaseRevolutions}>+</Button>
				<Button onclick={decreaseRevolutions} disabled={spinRevolutions <= 1}>-</Button>
			</div>
		</div>
		<Textarea {rows} bind:value={prize} />
		<Button onclick={() => (turn = !turn)} disabled={turn}>
			{turn ? '停止轉盤' : '開始轉盤'}
		</Button>
	</div>
</div>

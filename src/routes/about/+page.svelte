<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Button, Label } from 'flowbite-svelte';
	import _ from 'lodash';
	import PrizeWheel from '$lib/components/PrizeWheel.svelte';

	// 獎項列表 - 可以自由增減獎項數量
	let prizes = [
		'獎項A',
		'獎項B',
		'獎項C',
		'獎項D',
		'獎項E',
		'獎項F',
		'獎項G',
		'獎項H',
		'獎項I',
		'獎項J'
	];

	// 預設四個獎項，但可以動態調整
	let showMorePrizes = false;

	let turn = false;

	// 顏色列表 - 彩虹的顏色
	const colors = [
		'#e74c3c', // 紅色
		'#3498db', // 藍色
		'#2ecc71', // 綠色
		'#f39c12', // 橙色
		'#9b59b6', // 紫色
		'#1abc9c' // 青色
	];

	// 自定義轉盤設置
	let spinRevolutions = 5; // 轉動圈數
	let spinDuration = 4000; // 轉動時間，單位為毫秒
	let lastPrize = ''; // 記錄最後一次抽中的獎項

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
		turn = false; // 停止轉盤
	};
</script>

<div class="mx-auto">
	<Label class="mb-2">中獎: {lastPrize}</Label>
	<PrizeWheel
		{prizes}
		{colors}
		{spinDuration}
		{spinRevolutions}
		onResultChange={handlePrizeResult}
		{turn} />
	<div class="flex flex-col gap-4">
		<Button onclick={() => (turn = !turn)} disabled={turn}>
			{turn ? '停止轉盤' : '開始轉盤'}
		</Button>
	</div>
</div>

<script lang="ts">
	import { Label } from 'flowbite-svelte';
	import PrizeWheel from '$lib/components/PrizeWheel.svelte';

	// 獎項列表 - 可以自由增減獎項數量
	let prizes = ['獎項A', '獎項B', '獎項C', '獎項D'];

	// 預設四個獎項，但可以動態調整
	let showMorePrizes = false;

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

	// 切換獎項數量
	function toggleMorePrizes() {
		if (showMorePrizes) {
			prizes = ['獎項A', '獎項B', '獎項C', '獎項D'];
		} else {
			prizes = [
				'獎項A',
				'獎項B',
				'獎項C',
				'獎項D',
				'獎項E',
				'獎項F',
				'獎項G',
				'獎項H',
				'獎項I',
				'獎項J',
				'獎項K',
				'獎項L'
			];
		}
		showMorePrizes = !showMorePrizes;
	}

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
	function handlePrizeResult(resultData) {
		lastPrize = resultData.prize;
	}
</script>

<div class="mx-auto max-w-4xl px-4 py-8">
	<h1 class="mb-6 text-center text-3xl font-bold text-gray-800">抽獎轉盤示範</h1>

	<div class="mb-8 rounded-lg bg-gray-100 p-6 shadow-md">
		<h2 class="mb-4 text-xl font-semibold text-gray-700">轉盤設置</h2>

		<div class="mb-4 grid gap-4 sm:grid-cols-2">
			<div>
				<Label>旋轉圈數</Label>
				<div class="flex items-center">
					<button
						on:click={decreaseRevolutions}
						class="rounded-l-md bg-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-400">
						-
					</button>
					<span class="w-16 bg-white px-3 py-1 text-center">{spinRevolutions}</span>
					<button
						on:click={increaseRevolutions}
						class="rounded-r-md bg-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-400">
						+
					</button>
				</div>
			</div>

			<div>
				<Label>旋轉時間 (秒)</Label>
				<div class="flex items-center">
					<button
						on:click={decreaseDuration}
						class="rounded-l-md bg-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-400">
						-
					</button>
					<span class="w-16 bg-white px-3 py-1 text-center">{spinDuration / 1000}</span>
					<button
						on:click={increaseDuration}
						class="rounded-r-md bg-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-400">
						+
					</button>
				</div>
			</div>
		</div>

		<div class="mb-4">
			<button
				on:click={toggleMorePrizes}
				class="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
				{showMorePrizes ? '切換為4個獎項' : '切換為12個獎項'}
			</button>
		</div>

		{#if lastPrize}
			<p class="mt-2 text-lg font-semibold text-indigo-600">上次抽中：{lastPrize}</p>
		{/if}
	</div>

	<!-- 使用我們的轉盤元件 - Svelte 5 方式 -->
	<PrizeWheel
		{prizes}
		{colors}
		{spinDuration}
		{spinRevolutions}
		onResultChange={handlePrizeResult} />
</div>

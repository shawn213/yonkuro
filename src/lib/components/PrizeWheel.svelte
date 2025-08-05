<script lang="ts">
	// 定義元件的 props
	export let prizes: string[] = ['獎項A', '獎項B', '獎項C', '獎項D']; // 默認獎項
	export let colors: string[] = [
		'#d35400', '#2980b9', '#27ae60', '#8e44ad', '#f39c12',
		'#c0392b', '#16a085', '#2c3e50', '#7f8c8d', '#3498db',
		'#2ecc71', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c',
		'#1abc9c', '#34495e', '#95a5a6', '#5dade2', '#58d68d',
		'#af7ac5', '#f5b041', '#dc7633', '#ec7063', '#48c9b0',
		'#5d6d7e', '#aab7b8', '#7fb3d5', '#82e0aa', '#c39bd3'
	]; // 默認顏色 (30色，柔和對比)
	export let spinDuration: number = 4000; // 旋轉時間，單位為毫秒
	export let spinRevolutions: number = 5; // 旋轉圈數
	export let resultPrefix: string = '恭喜中獎：'; // 結果前綴
	export let resultSuffix: string = '！'; // 結果後綴
	export let turn: boolean = false; // 是否正在轉動

	let clazz: string = '';
	export { clazz as class };

	// 內部狀態
	let spinning = false;
	let rotation = 0;
	let result = '';
	let prizeColorMap = new Map<string, string>();

	// 計算扇形角度 - 根據獎項數量動態計算，確保精確均等分配
	$: segmentAngle = 360 / prizes.length; // 根據獎項數量動態計算每個扇形的角度

	// 當獎項變化時，為新獎項分配顏色，並保持舊獎項的顏色
	$: {
		const newPrizeSet = new Set(prizes);
		// 移除不再存在的獎項
		for (const prize of prizeColorMap.keys()) {
			if (!newPrizeSet.has(prize)) {
				prizeColorMap.delete(prize);
			}
		}

		// 為新獎項分配顏色
		prizes.forEach((prize) => {
			if (!prizeColorMap.has(prize)) {
				const usedColors = new Set(prizeColorMap.values());
				const availableColors = colors.filter((c) => !usedColors.has(c));
				const color =
					availableColors.length > 0
						? availableColors[0]
						: colors[Math.floor(Math.random() * colors.length)]; // 如果顏色用完，隨機選一個
				prizeColorMap.set(prize, color);
			}
		});
	}

	// 監聽獎項數量變化
	$: if (prizes) {
		// 當獎項數量變化時重置
		if (spinning) {
			spinning = false;
		}
		rotation = 0;
		result = '';
	}

	$: if (turn) {
		// 當 turn 為 true 時開始旋轉
		spin();
		turn = false; // 重置 turn 狀態
	}

	// 轉盤旋轉動畫
	async function spin() {
		if (spinning) return;
		spinning = true;
		result = '';

		// 模擬旋轉，旋轉角度增加多圈再停在隨機獎項
		const prizeIndex = Math.floor(Math.random() * prizes.length);

		// 修正旋轉邏輯，使指針指向獎項中間
		// 因為指針指向的是0度位置，需要讓獎項的中央對準指針
		// 加入半個扇形角度的偏移，使獎項正中間對齊指針
		const targetRotation = spinRevolutions * 360 + prizeIndex * segmentAngle + segmentAngle / 2;

		// 使用動畫控制旋轉
		const start = performance.now();

		function animate(time) {
			const elapsed = time - start;
			if (elapsed < spinDuration) {
				// ease out 旋轉速度
				const easeOut = 1 - Math.pow(1 - elapsed / spinDuration, 3);
				rotation = easeOut * targetRotation;
				requestAnimationFrame(animate);
			} else {
				rotation = targetRotation;
				result = `${resultPrefix}${prizes[prizeIndex]}${resultSuffix}`;
				spinning = false;
			}
		}
		requestAnimationFrame(animate);
	}

	// 定義結果事件處理器
	export let onResultChange: ((result: { prize: string; rotation: number }) => void) | undefined =
		undefined;

	// 當轉盤停止時，觸發結果事件
	$: if (result && !spinning) {
		const prizeData = {
			prize: prizes[Math.floor((rotation % 360) / segmentAngle)],
			rotation
		};

		// 使用 Svelte 5 的事件處理方式
		if (onResultChange) {
			onResultChange(prizeData);
		}
	}
</script>

<div
	class="relative mx-auto my-3 p-2.5 text-center font-mono transition-all duration-300 ease-in-out {clazz ||
		'h-80 w-80'}">
	<!-- 轉盤 - 旋轉方向為逆時針（負值）以符合直覺 -->
	<div
		class="linear relative mx-auto flex h-full w-full items-center justify-center overflow-hidden rounded-full border-8 border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-transform duration-100"
		style="transform: rotate({-rotation}deg);"
		aria-label="搖獎輪盤">
		{#each prizes as prize, i}
			<!-- 每個扇形區域 -->
			<div
				class="segment absolute top-0 left-0 z-10 h-full w-full origin-center"
				style="
                    --segment-angle: {segmentAngle}deg;
                    --segment-start-angle: {i * segmentAngle}deg;
                    --segment-color: {prizeColorMap.get(prize) || '#CCC'};
                ">
			</div>
		{/each}
		<!-- 文字層需要分開處理，確保正確顯示 -->
		{#each prizes as prize, i}
			<div
				class="text-container pointer-events-none absolute top-0 left-0 z-20 h-full w-full origin-center"
				style="--text-angle: {i * segmentAngle + segmentAngle / 2}deg;">
				<div
					class="prize-text shadow-text absolute top-[15%] left-1/2 z-20 -translate-x-1/2 rotate-90 text-center text-lg font-bold whitespace-nowrap text-white">
					{prize}
				</div>
			</div>
		{/each}
	</div>
	<div
		class="pointer ease absolute top-[-10px] left-1/2 z-10 h-0 w-0 -translate-x-1/2 border-t-[20px] border-r-[10px] border-l-[10px] border-t-red-600 border-r-transparent border-l-transparent drop-shadow-[0px_0px_5px_rgba(0,0,0,0.5)] transition-all duration-300">
	</div>
</div>

<style>
	/* 僅保留必要的自定義樣式，其餘使用 Tailwind 類名 */
	.shadow-text {
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
	}

	.segment {
		background: conic-gradient(
			from var(--segment-start-angle),
			var(--segment-color) 0deg,
			var(--segment-color) var(--segment-angle),
			transparent var(--segment-angle)
		);
	}

	.text-container {
		transform: rotate(var(--text-angle));
	}
</style>

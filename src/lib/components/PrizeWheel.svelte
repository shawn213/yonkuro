<script lang="ts">
	// 定義元件的 props
	export let prizes: string[] = ['獎項A', '獎項B', '獎項C', '獎項D']; // 默認獎項
	export let colors: string[] = [
		'#e74c3c', // 紅色
		'#3498db', // 藍色
		'#2ecc71', // 綠色
		'#f39c12', // 橙色
		'#9b59b6', // 紫色
		'#1abc9c', // 青色
		'#d35400', // 深橙色
		'#27ae60', // 深綠色
		'#8e44ad', // 深紫色
		'#f1c40f', // 黃色
		'#34495e', // 深藍色
		'#e67e22', // 橘色
		'#ecf0f1', // 淺灰色
		'#c0392b', // 深紅
		'#2980b9', // 深藍
		'#27ae60', // 深綠
		'#d35400', // 深橙
		'#8e44ad', // 深紫
		'#16a085', // 深青
		'#f39c12', // 橙色
		'#e67e22', // 橘色
		'#2c3e50', // 深藍灰
		'#7f8c8d', // 中灰
		'#bdc3c7', // 淺灰
		'#f1c40f', // 黃色
		'#c0392b', // 另一深紅
		'#34495e' // 深藍色
	]; // 默認顏色
	export let spinDuration: number = 4000; // 旋轉時間，單位為毫秒
	export let spinRevolutions: number = 5; // 旋轉圈數
	export let resultPrefix: string = '恭喜中獎：'; // 結果前綴
	export let resultSuffix: string = '！'; // 結果後綴
	export let turn: boolean = false; // 是否正在轉動

	// 內部狀態
	let spinning = false;
	let rotation = 0;
	let result = '';

	// 計算扇形角度 - 根據獎項數量動態計算，確保精確均等分配
	$: segmentAngle = 360 / prizes.length; // 根據獎項數量動態計算每個扇形的角度

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
	class="wheel-container relative mx-auto my-3 max-w-xs text-center font-mono sm:max-w-sm md:my-5 md:max-w-md lg:max-w-lg xl:max-w-xl">
	<!-- 轉盤 - 旋轉方向為逆時針（負值）以符合直覺 -->
	<div
		class="wheel relative mx-auto flex h-[300px] w-[300px] items-center justify-center overflow-hidden rounded-full border-8 border-gray-800"
		style="transform: rotate({-rotation}deg);"
		aria-label="搖獎輪盤">
		{#each prizes as _, i}
			<!-- 每個扇形區域 -->
			<div
				class="segment absolute top-0 left-0 z-10 h-full w-full origin-center"
				style="
                    --segment-angle: {segmentAngle}deg;
                    --segment-start-angle: {i * segmentAngle}deg;
                    --segment-color: {colors[i % colors.length]};
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
		class="pointer absolute top-[-10px] left-1/2 z-10 h-0 w-0 -translate-x-1/2 border-t-[20px] border-r-[10px] border-l-[10px] border-t-red-600 border-r-transparent border-l-transparent drop-shadow sm:border-t-[25px] sm:border-r-[12px] sm:border-l-[12px] md:border-t-[30px] md:border-r-[15px] md:border-l-[15px]">
	</div>
</div>

<style>
	/* 僅保留必要的自定義樣式，其餘使用 Tailwind 類名 */
	.shadow-text {
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
	}

	.drop-shadow {
		filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.5));
	}

	/* 將抽出的樣式定義在這裡 */
	.wheel-container {
		/* 增加平滑過渡效果 */
		transition: all 0.3s ease-in-out;
		padding: 10px;
	}

	.wheel {
		transition: transform 0.1s linear;
		/* 增加陰影效果 */
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
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

	.pointer {
		/* 增加陰影和過渡效果 */
		transition: all 0.3s ease;
	}

	/* 響應式設計 - 增加更多尺寸斷點 */
	@media (min-width: 1200px) {
		div[aria-label='搖獎輪盤'] {
			width: 450px !important;
			height: 450px !important;
		}
		.prize-text {
			font-size: 1.5rem !important;
		}
	}

	@media (min-width: 900px) and (max-width: 1199px) {
		div[aria-label='搖獎輪盤'] {
			width: 400px !important;
			height: 400px !important;
		}
		.prize-text {
			font-size: 1.3rem !important;
		}
	}

	@media (min-width: 768px) and (max-width: 899px) {
		div[aria-label='搖獎輪盤'] {
			width: 350px !important;
			height: 350px !important;
		}
	}

	@media (min-width: 601px) and (max-width: 767px) {
		div[aria-label='搖獎輪盤'] {
			width: 300px !important;
			height: 300px !important;
		}
	}

	@media (min-width: 481px) and (max-width: 600px) {
		div[aria-label='搖獎輪盤'] {
			width: 250px !important;
			height: 250px !important;
		}
		.prize-text {
			font-size: 1rem !important;
			top: 12% !important;
		}
	}

	@media (min-width: 401px) and (max-width: 480px) {
		div[aria-label='搖獎輪盤'] {
			width: 220px !important;
			height: 220px !important;
		}
		.prize-text {
			font-size: 0.9rem !important;
			top: 10% !important;
		}
	}

	@media (max-width: 400px) {
		div[aria-label='搖獎輪盤'] {
			width: 200px !important;
			height: 200px !important;
		}
		.prize-text {
			font-size: 0.8rem !important;
			top: 8% !important;
		}
	}

	/* 橫向模式特別處理 */
	@media (max-height: 500px) and (orientation: landscape) {
		div[aria-label='搖獎輪盤'] {
			width: 200px !important;
			height: 200px !important;
		}
		.prize-text {
			font-size: 0.8rem !important;
		}
	}
</style>

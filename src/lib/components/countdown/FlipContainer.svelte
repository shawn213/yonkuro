<script>
	// 完全不使用反應式效果，改用 props 的衍生值
	import AnimatedCard from './AnimatedCard.svelte';
	import StaticCard from './StaticCard.svelte';

	// 使用常規 props 傳入，不使用反應式宣告
	let { digit, color = 'text-red-500', textSize = 'text-sm md:text-3xl lg:text-5xl' } = $props();

	// 固定的動畫狀態，不再使用反應式
	const animStates = [
		{ flip: false, animation: 'fold', animation2: 'unfold' },
		{ flip: true, animation: 'unfold', animation2: 'fold' }
	];

	// 使用 digit 作為索引來選擇動畫狀態，這樣當 digit 改變時，動畫狀態也會自動改變
	// 使用餘數確保始終只使用兩個狀態之一
	let animIndex = $derived(Math.abs(digit) % 2);
	let animationState = $derived(animStates[animIndex]);
	let previousDigit = $derived(digit + 1);
</script>

<div
	class="flip-container perspective-300 relative block h-[55px] w-[50px] justify-self-center overflow-hidden rounded-lg bg-[hsl(236,21%,26%)] shadow-lg md:h-[105px] md:w-[95px] lg:h-[155px] lg:w-[145px]">
	<StaticCard position="upperCard" {digit} {color} {textSize} />
	<StaticCard position="lowerCard" digit={previousDigit} {color} {textSize} />
	<AnimatedCard
		digit={animationState.flip ? digit : previousDigit}
		animation={animationState.animation}
		{color}
		{textSize} />
	<AnimatedCard
		digit={animationState.flip ? previousDigit : digit}
		animation={animationState.animation2}
		{color}
		{textSize} />
</div>

<style>
	.perspective-300 {
		perspective-origin: 50% 50%;
		perspective: 300px;
	}

	.flip-container::before {
		content: '';
		position: absolute;
		height: 8px;
		width: 8px;
		left: -4px;
		top: calc(50% - 4px);
		border-radius: 50%;
		background-color: hsl(234, 17%, 12%);
		z-index: 1;
	}

	.flip-container::after {
		content: '';
		position: absolute;
		height: 8px;
		width: 8px;
		right: -4px;
		top: calc(50% - 4px);
		border-radius: 50%;
		background-color: hsl(234, 17%, 12%);
	}

	@media screen and (min-width: 500px) {
		.flip-container::before {
			height: 10px;
			width: 10px;
			left: -5px;
			top: calc(50% - 5px);
		}

		.flip-container::after {
			height: 10px;
			width: 10px;
			right: -5px;
			top: calc(50% - 5px);
		}
	}

	@media screen and (min-width: 800px) {
		.flip-container::before {
			height: 12px;
			width: 12px;
			left: -6px;
			top: calc(50% - 6px);
		}

		.flip-container::after {
			height: 12px;
			width: 12px;
			right: -6px;
			top: calc(50% - 6px);
		}
	}
</style>

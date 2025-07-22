<script>
	export let animation;
	export let digit;
	export let color = 'text-red-500';
	export let textSize;
</script>

<div class="flipCard absolute left-0 flex h-2/4 w-full justify-center overflow-hidden {animation}">
	<span class="{textSize} font-bold {color}">{`${digit < 10 ? 0 : ''}`}{digit}</span>
</div>

<style>
	.flipCard {
		backface-visibility: hidden;
	}

	.flipCard.unfold {
		top: 50%;
		align-items: flex-start;
		transform-origin: 50% 0%;
		transform: rotateX(180deg); /* from 180 to 0 */
		background-color: hsl(236, 21%, 26%);
		border-bottom-left-radius: 8px;
		border-bottom-right-radius: 8px;
		border-top: 0.5px solid rgba(0, 0, 0, 0.3);
		background-color: hsl(236, 21%, 31%);
	}

	.flipCard.unfold span {
		transform: translateY(-51%);
	}

	.flipCard.fold {
		top: 0%;
		align-items: flex-end;
		transform-origin: 50% 100%;
		transform: rotateX(0deg); /* from 0 to -180 */
		background-color: hsl(236, 21%, 26%);
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
	}

	.flipCard.fold span {
		transform: translateY(51%);
	}

	.fold {
		animation: fold 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0s 1 normal forwards;
		transform-style: preserve-3d;
	}

	.unfold {
		animation: unfold 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0s 1 normal forwards;
		transform-style: preserve-3d;
	}

	@keyframes fold {
		0% {
			transform: rotateX(0deg);
		}
		100% {
			transform: rotateX(-180deg);
		}
	}

	@keyframes unfold {
		0% {
			transform: rotateX(180deg);
		}
		100% {
			transform: rotateX(0deg);
		}
	}
</style>

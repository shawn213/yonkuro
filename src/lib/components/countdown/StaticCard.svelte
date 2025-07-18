<script>
	export let position;
	export let digit;
	export let color = 'text-red-500';
	export let textSize;
</script>

<div class={position}>
	<span class="{textSize} font-bold {color}">{`${digit < 10 ? 0 : ''}`}{digit}</span>
</div>

<style>
	.upperCard,
	.lowerCard {
		display: flex;
		position: relative;
		justify-content: center;
		width: 100%;
		height: 50%;
		overflow: hidden;
		color: hsl(236, 21%, 31%);
	}

	.upperCard {
		align-items: flex-end;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}

	.upperCard span {
		transform: translateY(51%);
	}

	.lowerCard {
		align-items: flex-start;
		border-bottom-left-radius: 8px;
		border-bottom-right-radius: 8px;
		background-color: hsl(236, 21%, 31%);
		border-top: 0.5px solid rgba(0, 0, 0, 0.3);
	}

	.lowerCard span {
		transform: translateY(-51%);
	}
</style>

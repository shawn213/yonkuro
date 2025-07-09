<script lang="ts">
	import { Input, Button, Spinner, Label, Span } from 'flowbite-svelte';
	import { ExclamationCircleSolid } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';

	// 使用陣列的陣列來存儲所有輪子的符號
	let allSymbols = [
		['A', 'B', 'C', 'D', 'E'],
		['1', '2', '3', '4', '5']
	];

	// 當前顯示的符號
	let currentSlots = allSymbols.map((symbols) => symbols[0]);

	let spinning = false;
	let result = '';

	// 輸入框的陣列
	let inputs = [];
	let slotWidth = 200; // 預設寬度

	// 動態計算寬度
	$: {
		// 找出所有陣列中最長的符號
		const maxLength = allSymbols.reduce((maxLen, symbols) => {
			const longestInReel = symbols.reduce(
				(max, symbol) => (symbol.length > max.length ? symbol : max),
				''
			);
			return longestInReel.length > maxLen.length ? longestInReel : maxLen;
		}, '');

		// 也考慮當前顯示的符號
		const maxCurrentLength = currentSlots.reduce(
			(max, slot) => (slot.length > max.length ? slot : max),
			''
		);

		// 計算最長符號的字元數
		const maxChars = Math.max(maxLength.length, maxCurrentLength.length);

		// 根據字元數計算寬度
		slotWidth = maxChars * 20 + 100;

		// 確保最小寬度
		slotWidth = Math.max(slotWidth, 100);
	}

	// 新增一個轉輪
	function addReel() {
		allSymbols = [...allSymbols, ['X', 'Y', 'Z']];
		currentSlots = [...currentSlots, 'X'];
		inputs = [...inputs, 'X, Y, Z'];
	}

	// 移除一個轉輪
	function removeReel() {
		if (allSymbols.length > 1) {
			allSymbols = allSymbols.slice(0, -1);
			currentSlots = currentSlots.slice(0, -1);
			inputs = inputs.slice(0, -1);
		}
	}

	async function spin() {
		spinning = true;
		result = '';

		// 模擬轉動效果
		for (let i = 0; i < 15; i++) {
			currentSlots = allSymbols.map(
				(symbols) => symbols[Math.floor(Math.random() * symbols.length)]
			);
			await new Promise((resolve) => setTimeout(resolve, 50));
		}

		spinning = false;

		// 決定最終結果
		const finalSlots = allSymbols.map(
			(symbols) => symbols[Math.floor(Math.random() * symbols.length)]
		);

		currentSlots = finalSlots;

		// 檢查是否所有槽都顯示相同的符號
		const allSame = finalSlots.every((slot) => slot === finalSlots[0]);

		if (allSame) {
			result = '恭喜中獎！';
		} else {
			result = '再試一次！';
		}
	}

	// 更新所有符號陣列
	function updateSymbols() {
		allSymbols = inputs.map((input, index) => {
			const symbols = input
				.split(/[\r\n,;]+/)
				.map((s: string) => s.trim())
				.filter((s: string) => s);
			// 如果陣列為空，使用預設值
			if (symbols.length === 0) {
				return index === 0 ? ['A', 'B', 'C', 'D', 'E'] : ['1', '2', '3', '4', '5'];
			}
			return symbols;
		});

		// 更新顯示值
		currentSlots = allSymbols.map((symbols) => symbols[0]);
	}

	// 初始化輸入框
	onMount(() => {
		inputs = allSymbols.map((symbols) => symbols.join(', '));
	});
</script>

<div class="flex items-center justify-center">
	<div class="rounded p-2">
		<div class="mb-4 flex flex-wrap justify-center gap-4">
			{#each currentSlots as slot, i}
				<div
					class="flex h-24 items-center justify-center overflow-hidden rounded border border-gray-500 text-3xl font-bold"
					style="width: {slotWidth}px;">
					<Span class="mx-2 text-ellipsis whitespace-nowrap">{slot}</Span>
				</div>
			{/each}
		</div>
		<div class="mb-4 flex justify-center gap-2">
			<Button size="xs" color="green" onclick={addReel}>新增轉輪</Button>
			<Button size="xs" color="red" onclick={removeReel} disabled={allSymbols.length <= 1}>
				移除轉輪
			</Button>
		</div>

		{#each inputs as _, i}
			<div class="mb-4">
				<Label for="symbols{i}" class="mb-2 block text-sm font-bold">
					符號 {i + 1} (用逗號分隔):
				</Label>
				<Input type="text" id="symbols{i}" bind:value={inputs[i]} />
			</div>
		{/each}

		<div class="grid grid-cols-2 gap-4">
			<Button onclick={updateSymbols}>更新符號</Button>
			<Button color={spinning ? 'alternative' : 'green'} onclick={spin} disabled={spinning}>
				開始轉動
			</Button>
		</div>

		{#if result}
			<p class="flex w-full items-center justify-center">
				{#if result === '再試一次！'}
					<ExclamationCircleSolid />
				{/if}
				{result}
			</p>
		{/if}
	</div>
</div>

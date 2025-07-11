<script lang="ts">
	import { Input, Button, Label, Span, Table, Toggle } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	// 使用陣列的陣列來存儲所有輪子的符號
	let allSymbols = [
		['A', 'B', 'C', 'D', 'E'],
		['1', '2', '3', '4', '5']
	];

	// 當前顯示的符號
	let currentSlots = allSymbols.map((symbols) => symbols[0]);

	let spinning = false;
	let items = [];
	let isGroupMode = false; // 添加分組模式開關

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
		items = []; // 清空結果
		allSymbols = [...allSymbols, ['X', 'Y', 'Z']];
		currentSlots = [...currentSlots, 'X'];
		inputs = [...inputs, 'X, Y, Z'];
	}

	// 移除一個轉輪
	function removeReel() {
		items = []; // 清空結果
		if (allSymbols.length > 1) {
			allSymbols = allSymbols.slice(0, -1);
			currentSlots = currentSlots.slice(0, -1);
			inputs = inputs.slice(0, -1);
		}
	}

	async function spin() {
		spinning = true;

		// 模擬轉動效果
		for (let i = 0; i < 15; i++) {
			currentSlots = allSymbols.map(
				(symbols) => symbols[Math.floor(Math.random() * symbols.length)]
			);
			await new Promise((resolve) => setTimeout(resolve, 50));
		}

		spinning = false;

		if (isGroupMode && allSymbols.length >= 2) {
			// 分組模式邏輯
			const groups = allSymbols[0]; // 第一個陣列作為組別
			const itemsToGroup = allSymbols.slice(1).flat(); // 其他所有陣列的元素

			// 隨機打亂待分組項目
			const shuffledItems = [...itemsToGroup].sort(() => Math.random() - 0.5);
			currentSlots = [groups[0], shuffledItems[0]]; // 更新顯示的符號

			// 計算每組應分配的成員數量
			const membersPerGroup = Math.floor(shuffledItems.length / groups.length);
			const remainingMembers = shuffledItems.length % groups.length;

			// 進行分組
			let startIndex = 0;
			items = groups.map((group, index) => {
				const count = membersPerGroup + (index < remainingMembers ? 1 : 0);
				const members = shuffledItems.slice(startIndex, startIndex + count);
				startIndex += count;
				return { team: group, member: members.join(', ') };
			});
		} else {
			// 原始模式邏輯
			let finalSlots = allSymbols.map(
				(symbols) => symbols[Math.floor(Math.random() * symbols.length)]
			);

			// 檢查是否有重複值，如果有，重新隨機取值
			for (let i = 0; i < finalSlots.length; i++) {
				for (let j = i + 1; j < finalSlots.length; j++) {
					if (finalSlots[i] === finalSlots[j]) {
						// 重新隨機取值
						finalSlots[j] = allSymbols[j].sort(() => Math.random() - 0.5)[0]; // 確保取到不同的值
					}
				}
			}

			currentSlots = finalSlots;

			// 創建一個包含所有 value 的物件
			const resultItem = {};
			for (let i = 0; i < finalSlots.length; i++) {
				resultItem[`value${i + 1}`] = finalSlots[i];
			}

			items = [...items, resultItem];
		}
	}

	// 更新所有符號陣列
	async function updateSymbols() {
		items = [];
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
	onMount(async () => {
		inputs = allSymbols.map((symbols) => symbols.join(', '));
	});
</script>

<div class="flex justify-center">
	<div class="rounded p-2">
		<div class="mb-4 flex flex-wrap justify-center gap-4">
			{#each currentSlots as slot}
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
			<div class="flex items-center">
				<Toggle bind:checked={isGroupMode} class="mx-2" color="blue" />
				<span>分組模式</span>
			</div>
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
	</div>
</div>
{#if items.length > 0}
	<div class="mt-4 flex justify-center overflow-x-auto">
		<Table color="green" striped shadow {items}></Table>
	</div>
{/if}

<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Input,
		Button,
		TableBodyCell,
		Toggle,
		Span,
		Checkbox,
		Helper,
		Listgroup,
		Tooltip,
		Img
	} from 'flowbite-svelte';
	import { CloseOutline } from 'flowbite-svelte-icons';
	import _ from 'lodash';
	import { getSpreadsheetValues } from '$lib/utils/googleSheets';
	import { alertStore } from '$stores/alertStore';
	import PrizeWheel from '$lib/components/PrizeWheel.svelte';
	import { assets } from '$app/paths';

	let items = [];
	let prizes = [];
	let prizesList = []; // 用於存儲獎項列表
	const imageUrl = `${assets}/example.png`; // 使用 SvelteKit 的資產路徑

	// boolean
	let turn = false;
	let showPrizeWheel = false;
	let removePrize = false; // 是否允許刪除獎項

	// input
	let sheetID = ''; // Example sheet ID
	let sheetName = ''; // Example sheet name
	let header = ''; // Example header

	const fetchData = async () => {
		const { rows, status } = await getSpreadsheetValues(sheetID, sheetName);
		switch (status) {
			case 200:
				items = rows;
				break;
			case 403:
				alertStore.set({
					color: 'yellow',
					message: `請確認您所輸入的 sheetID 是否為知道連結可讀取狀態。`,
					timeout: 10000
				});
				break;
			case 404:
				alertStore.set({
					color: 'red',
					message: `找不到表單 ${sheetName}，請確認 sheetID 和 sheetName 是否正確。`,
					timeout: 10000
				});
				break;
			default:
				alertStore.set({
					color: 'red',
					message: `讀取表單 ${sheetName} 時發生錯誤，狀態碼：${status}`,
					timeout: 10000
				});
		}
	};

	// 刪除最後一個元素，但如果只有一個元素就不刪除
	const removeItem = (index: number) => {
		if (items.length > 1) {
			items = items.filter((_, i) => i !== index);
		}
	};

	const handlePrizeResult = (resultData) => {
		prizesList = [resultData.prize, ...prizesList];
		if (removePrize) {
			prizes = _.without(prizes, resultData.prize); // 移除已抽中的獎項
		}
		turn = false; // 停止轉盤
	};

	$: if (header) {
		prizes = items.map((item) => item[header]).filter((item) => item && item.trim() !== '');
	}
</script>

<div class="space-y-2">
	<div class="flex items-center space-x-2">
		<Span>關閉</Span>
		<Toggle bind:checked={showPrizeWheel} />
		<Span>開啟</Span>
	</div>
	{#if showPrizeWheel}
		<div class="flex flex-row space-x-2">
			<div class="w-1/4 space-y-2">
				<PrizeWheel {prizes} onResultChange={handlePrizeResult} {turn} />
				<Button onclick={() => (turn = !turn)} disabled={turn}>
					{turn ? '停止轉盤' : '開始轉盤'}
				</Button>
				<div class="flex items-center space-x-2">
					<Checkbox bind:checked={removePrize}>允許刪除獎項</Checkbox>
					<Helper>刪除獎項後將無法恢復</Helper>
				</div>
			</div>
			<Listgroup class="h-96 w-1/4 overflow-y-auto" items={prizesList} />
		</div>
	{/if}
	<div class="flex flex-row space-x-4">
		<Input
			type="text"
			id="ref-sheetID"
			placeholder="sheetID"
			bind:value={sheetID}
			class="mb-4 w-1/4" />
		<Input
			type="text"
			id="ref-sheetName"
			placeholder="sheet name"
			bind:value={sheetName}
			class="mb-4 w-1/8" />
		<Input
			type="text"
			id="ref-header"
			placeholder="header"
			bind:value={header}
			class="mb-4 w-1/8" />
		<Button class="mb-4" onclick={fetchData}>讀取表單</Button>
	</div>
	{#if items.length > 0}
		<div class="h-100 overflow-x-auto">
			<Table>
				<TableHead>
					{#each Object.keys(items[0] || {}) as headerCell}
						<TableHeadCell>{headerCell}</TableHeadCell>
					{/each}
					<TableBodyCell class="text-center">Actions</TableBodyCell>
				</TableHead>
				<TableBody>
					{#each items as item, index}
						<TableBodyRow>
							{#each Object.values(item) as value}
								<TableBodyCell>{value}</TableBodyCell>
							{/each}
							<TableBodyCell class="flex justify-center">
								<CloseOutline color="lime" onclick={() => removeItem(index)} />
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		</div>
	{/if}
</div>
<Tooltip triggeredBy="[id^='ref-']" placement="bottom">
	<div class="flex flex-col space-y-2">
		<Span>1. 網址列塗黑區塊是你的 sheetID</Span>
		<Span>2. 最下方紅框是你的 sheet name</Span>
		<Span>3. 必須確認你的 sheet 權限是開啟的狀態</Span>
		<Span>4. header 是你要拿來抽籤的欄位名稱</Span>
	</div>
	<Img src={imageUrl} alt="Example Image" class="h-auto w-200" />
</Tooltip>

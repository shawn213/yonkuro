<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Button,
		Input,
		Select
	} from 'flowbite-svelte';
	import {
		PlusOutline,
		CloseOutline,
		FileCloneOutline,
		AngleLeftOutline,
		AngleRightOutline,
		EditOutline,
		UploadOutline,
		FileCheckOutline,
		UndoOutline
	} from 'flowbite-svelte-icons';
	import dayjs from 'dayjs';
	import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
	import weekOfYear from 'dayjs/plugin/weekOfYear';
	import weekday from 'dayjs/plugin/weekday';
	import updateLocale from 'dayjs/plugin/updateLocale';
	import customParseFormat from 'dayjs/plugin/customParseFormat';
	import { holidayStore } from '$stores/holidayStore';
	import { alertStore, type AlertMessage } from '$stores/alertStore';
	import { workDataStore } from '$stores/localforageStore';
	import _ from 'lodash';

	// 擴展 dayjs 使其能使用 isSameOrBefore 方法
	dayjs.extend(isSameOrBefore);
	dayjs.extend(weekOfYear);
	dayjs.extend(weekday);
	dayjs.extend(updateLocale);
	dayjs.extend(customParseFormat);

	dayjs.updateLocale('en', {
		weekStart: 1, // 設置一週的第一天為星期一
		weekdays: ['日', '一', '二', '三', '四', '五', '六']
	});

	const baseItem = { name: '項目', base: 1 };
	let selectedWeek = `${dayjs().format('YYYY')}-W${dayjs().week()}`;
	let previousWeek = null;
	let holidays = { days: [] };
	let workDay = 0;
	// 新增月份選擇相關變數
	let availableMonths = [];
	let selectedMonth = dayjs().format('YYYY/MM'); // 預設為當前月份

	// 新增月份資料儲存物件
	let monthDataStore = {};
	// 先前的月份資料
	let previousMonthData = {};
	// 是否編輯
	let isEditing = false;
	// 上傳時使用的圖示
	let uploadIcon = UploadOutline;

	const isWorkDay = (date: any) => {
		return (
			[1, 2, 3, 4, 5].includes(date.day()) &&
			!holidays.days.some((h: any) => h.date === date.format('YYYY-MM-DD'))
		);
	};

	const getWeekMondayAndFriday = (inputWeek: string) => {
		// 用dayjs先定位該年1月1日，再設置isoWeek數，得到該週週一
		const dateMonday = dayjs(inputWeek, 'YYYY-Www').startOf('week');
		// 週五為週一+4天
		const dateFriday = dateMonday.add(4, 'day');

		return {
			monday: dateMonday,
			friday: dateFriday
		};
	};

	const getDaysRangeOfWeekInMonth = (weekStr, month) => {
		// 計算指定週的週一日期
		const mondayDate = dayjs(weekStr, 'YYYY-Www').startOf('week');

		let result = [];

		for (let i = 0; i < 5; i++) {
			// 星期一到星期五
			const date = mondayDate.add(i, 'day');
			if (date.format('YYYY/MM') === month) {
				result.push({
					date: date.format('MMDD'),
					weekDay: date.format('dddd')
				});
			}
		}

		return result;
	};

	// 更新指定月份指定週的工作日數據
	const updateWeekDays = () => {
		const weekDays = {};
		// 從週一到週五添加日期
		const daysInWeek = getDaysRangeOfWeekInMonth(selectedWeek, selectedMonth);
		daysInWeek.forEach((day) => {
			weekDays[day.date] = 0; // 初始化每個日期的值為0
		});

		// 否則返回單一基本項目
		return [{ ...baseItem, ...weekDays }];
	};

	onMount(async () => {
		previousWeek = selectedWeek;

		// 訂閱假日數據
		holidayStore.subscribe((hs) => {
			holidays = hs;
		});

		const workData = await workDataStore.getItem('workData');

		if (workData) {
			monthDataStore = workData;
		} else {
			monthDataStore[selectedMonth] = updateWeekDays();
		}
	});

	// 檢查週次是否跨月並取得可用月份
	const getAvailableMonths = (weekStr) => {
		if (!weekStr) return [];

		const weekRange = getWeekMondayAndFriday(weekStr);
		const startMonth = weekRange.monday.month();
		const endMonth = weekRange.friday.month();

		// 如果週次跨月，返回兩個月份選項
		if (startMonth !== endMonth) {
			return [
				{ value: weekRange.monday.format('YYYY/MM'), name: weekRange.monday.format('YYYY/MM') },
				{ value: weekRange.friday.format('YYYY/MM'), name: weekRange.friday.format('YYYY/MM') }
			];
		}

		// 如果只在同一個月，返回單一月份
		return [
			{ value: weekRange.monday.format('YYYY/MM'), name: weekRange.monday.format('YYYY/MM') }
		];
	};

	// 當週次變更時更新可用月份並設定預設選擇
	$: {
		if (selectedWeek) {
			availableMonths = getAvailableMonths(selectedWeek);
			// 預設選擇第一個月份
			if (!_.some(availableMonths, { value: selectedMonth })) {
				selectedMonth = availableMonths.length > 0 ? availableMonths[0].value : '';
			}
			if (monthDataStore[selectedMonth] === undefined) {
				monthDataStore[selectedMonth] = updateWeekDays();
			}
		}
		if (selectedMonth) {
			workDay = 0;
			const { monday, friday } = getWeekMondayAndFriday(selectedWeek);
			let baseDay = monday.startOf('month');
			if (monday.format('YYYY/MM') === selectedMonth) {
				baseDay = monday.startOf('month');
			} else {
				baseDay = friday.startOf('month');
			}
			const endDay = baseDay.endOf('month').startOf('date');
			do {
				workDay += isWorkDay(baseDay) ? 1 : 0;
				baseDay = baseDay.add(1, 'days');
			} while (endDay.diff(baseDay, 'days') >= 0);
		}
	}

	$: if (monthDataStore[selectedMonth] && monthDataStore[selectedMonth].length > 0) {
		monthDataStore[selectedMonth].map((item) => {
			// 確保每個項目都有基本結構
			if (!item.name) item.name = baseItem.name;
			if (item.base === undefined) item.base = baseItem.base;
			// 確保每個日期都有對應的值
			const daysInWeek = getDaysRangeOfWeekInMonth(selectedWeek, selectedMonth);
			daysInWeek.forEach((day) => {
				if (item[day.date] === undefined) {
					item[day.date] = 0; // 初始化為0
				}
			});
		});
	}

	// 複製最後一個元素添加到 items 中
	const addItem = () => {
		const lastItem = monthDataStore[selectedMonth][monthDataStore[selectedMonth].length - 1];
		if (lastItem) {
			const newItem = { ...lastItem };
			monthDataStore[selectedMonth] = [...monthDataStore[selectedMonth], newItem];
		}
	};

	// 刪除最後一個元素，但如果只有一個元素就不刪除
	const removeItem = (index: number) => {
		if (monthDataStore[selectedMonth].length > 1) {
			monthDataStore[selectedMonth] = monthDataStore[selectedMonth].filter((_, i) => i !== index);
		}
	};

	const copyMonthSettings = (direction: 'previous' | 'next') => {
		const allMonths = Object.keys(monthDataStore);
		const currentMonthObj = dayjs(selectedMonth, 'YYYY/MM');

		const availableMonths = allMonths
			.filter((monthKey) => {
				if (!monthDataStore[monthKey] || monthDataStore[monthKey].length === 0) {
					return false;
				}
				const monthKeyObj = dayjs(monthKey, 'YYYY/MM');
				return direction === 'previous'
					? monthKeyObj.isBefore(currentMonthObj, 'month')
					: monthKeyObj.isAfter(currentMonthObj, 'month');
			})
			.sort((a, b) => {
				return direction === 'previous'
					? dayjs(b, 'YYYY/MM').diff(dayjs(a, 'YYYY/MM')) // 最近的月份在前面
					: dayjs(a, 'YYYY/MM').diff(dayjs(b, 'YYYY/MM')); // 最近的月份在前面
			});

		if (availableMonths.length === 0) {
			const directionText = direction === 'previous' ? '先前' : '後續';
			alertStore.set({
				message: `找不到可供複製的${directionText}月份資料。`,
				color: 'red'
			} as AlertMessage);
			return;
		}

		const targetMonthKey = availableMonths[0]; // 取得排序後的第一個月份
		const targetMonthItems = monthDataStore[targetMonthKey];

		// 取得當前選擇週的日期鍵，並將值初始化為 0
		const currentWeekDays = {};
		const daysInWeek = getDaysRangeOfWeekInMonth(selectedWeek, selectedMonth);
		daysInWeek.forEach((day) => {
			currentWeekDays[day.date] = 0;
		});

		// 複製前先備份
		previousMonthData[selectedMonth] = _.cloneDeep(monthDataStore[selectedMonth]);

		// 複製找到的月份的 name 和 base，並使用當前週的日期結構
		monthDataStore[selectedMonth] = targetMonthItems.map((item) => ({
			name: item.name,
			base: item.base,
			...currentWeekDays
		}));
	};

	const saveData = async () => {
		if (browser) {
			await workDataStore.setItem('workData', monthDataStore);
			uploadIcon = FileCheckOutline;
			setTimeout(() => {
				uploadIcon = UploadOutline;
			}, 2000);
		}
	};

	const changeWeek = (direction: 'previous' | 'next') => {
		const currentWeek = dayjs(`${selectedWeek}`, 'YYYY-Www');
		if (direction === 'previous') {
			selectedWeek = `${currentWeek.format('YYYY')}-W${currentWeek.subtract(1, 'week').week()}`;
		} else if (direction === 'next') {
			selectedWeek = `${currentWeek.format('YYYY')}-W${currentWeek.add(1, 'week').week()}`;
		}
	};

	const removeMonth = () => {
		if (monthDataStore[selectedMonth]) {
			monthDataStore = _.omit(monthDataStore, selectedMonth);
		}
		alertStore.set({
			message: `已刪除 ${selectedMonth} 的工作資料。`,
			color: 'green'
		} as AlertMessage);
	};

	const revertToPreviousMonth = () => {
		if (previousMonthData[selectedMonth]) {
			monthDataStore[selectedMonth] = _.cloneDeep(previousMonthData[selectedMonth]);
			alertStore.set({
				message: `已恢復 ${selectedMonth} 的工作資料。`,
				color: 'green'
			} as AlertMessage);
		} else {
			alertStore.set({
				message: `沒有可恢復的 ${selectedMonth} 資料。`,
				color: 'red'
			} as AlertMessage);
		}
	};

	onDestroy(() => {
		saveData();
	});
</script>

<div class="mb-2 flex flex-col items-center justify-center space-y-2">
	<div class="flex flex-row items-center gap-2">
		<Button size="xs" onclick={() => changeWeek('previous')}>
			<AngleLeftOutline />
		</Button>
		<Input type="week" bind:value={selectedWeek} />
		<!-- 當週次跨月時顯示月份選擇器 -->
		{#if availableMonths.length > 1}
			<Select bind:value={selectedMonth} items={availableMonths} />
		{/if}
		<Button size="xs" onclick={() => changeWeek('next')}>
			<AngleRightOutline />
		</Button>
	</div>
	<div class="flex flex-row items-center gap-2">
		<Button size="xs" onclick={() => copyMonthSettings('previous')}>
			<FileCloneOutline /> 複製上月
		</Button>
		<Button size="xs" onclick={() => copyMonthSettings('next')}>
			<FileCloneOutline /> 複製下月
		</Button>
		<Button size="xs" onclick={() => revertToPreviousMonth()}>
			<UndoOutline /> 恢復
		</Button>
		<Button size="xs" onclick={addItem}><PlusOutline /></Button>
		<Button size="xs" onclick={removeMonth} disabled={!monthDataStore[selectedMonth]}>
			<CloseOutline /> 刪除本月
		</Button>
		<Button size="xs" onclick={saveData} disabled={uploadIcon === FileCheckOutline}>
			<svelte:component this={uploadIcon} /> 上傳
		</Button>
	</div>
</div>
<Table>
	<TableHead>
		<TableHeadCell class="flex flex-row items-center space-x-2">
			<div>專案</div>
			<EditOutline onclick={() => (isEditing = !isEditing)} />
		</TableHeadCell>
		<TableHeadCell>基數</TableHeadCell>
		<TableHeadCell>總時數</TableHeadCell>
		<TableHeadCell>目前時數</TableHeadCell>
		{#each getDaysRangeOfWeekInMonth(selectedWeek, selectedMonth) as day}
			<TableHeadCell>{day.date} ({day.weekDay})</TableHeadCell>
		{/each}
		{#if isEditing}
			<TableHeadCell>動作</TableHeadCell>
		{/if}
	</TableHead>
	<TableBody>
		{#each monthDataStore[selectedMonth] as item, idx}
			<TableBodyRow>
				{@const percentTime = Math.round(workDay * 8 * item.base * 10) / 10}
				{@const totalTime = _.filter(
					item,
					(_value, key) => key !== 'name' && key !== 'base'
				).reduce((sum, val) => sum + (val || 0), 0)}
				{@const isOver = totalTime > percentTime}
				<!-- 假設每天工作8小時 -->
				{#if isEditing}
					<TableBodyCell><Input bind:value={item.name} /></TableBodyCell>
					<TableBodyCell><Input type="number" bind:value={item.base} min="0" /></TableBodyCell>
				{:else}
					<TableBodyCell>{item.name}</TableBodyCell>
					<TableBodyCell>{item.base}</TableBodyCell>
				{/if}
				<TableBodyCell>{percentTime}</TableBodyCell>
				<TableBodyCell class={[isOver && 'text-red-500']}>{totalTime}</TableBodyCell>
				{#each getDaysRangeOfWeekInMonth(selectedWeek, selectedMonth) as day}
					{@const dateKey = day.date}
					<TableBodyCell>
						<Input type="number" bind:value={item[dateKey]} min="0" />
					</TableBodyCell>
				{/each}
				{#if isEditing}
					<TableBodyCell>
						<CloseOutline color="lime" onclick={() => removeItem(idx)} />
					</TableBodyCell>
				{/if}
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>

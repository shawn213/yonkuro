<script lang="ts">
	import { Label, Input, Textarea, Button, Toggle } from 'flowbite-svelte';
	import _ from 'lodash';
	import Copy from '$lib/components/Copy.svelte';

	const rows = 5;
	let javaToggle = false;
	let tableName = '';
	let column = '';
	let primaryKey = '';
	let result = '';

	const handleClick = () => {
		const columns = column.split(/\s?,\s?/).filter((key) => !_.isEmpty(key));
		const primaryKeys = primaryKey.split(/\s?,\s?/).filter((key) => !_.isEmpty(key));

		// 去除 columns 中與 primaryKeys 重複的部分
		const uniqueColumns = columns.filter((col) => !primaryKeys.includes(col));
		// 所有欄位 (主鍵 + 一般欄位，不重複)
		const allColumns = [...primaryKeys, ...uniqueColumns];

		result = `
<script>
  insert into ${tableName} (
    ${allColumns.join(', ')}
  )
  values
  <foreach collection='list' item='vo' index='index' separator=','>
    (
      ${allColumns
				.map((key) => _.camelCase(key))
				.map((key) => `#{vo.${key}}`)
				.join(', ')}
    )
  </foreach>
  on conflict(${primaryKeys.join(', ')})
  do update set
  ${uniqueColumns.map((key) => `${key} = EXCLUDED.${key}`).join(',\n')}
<\/script>
  `;
		result = result
			.split('\n')
			.map((line) => _.trim(line))
			.filter((line) => line)
			.join('\n');
		if (javaToggle) {
			result = result
				.split('\n')
				.map((line) => _.trim(line))
				.filter((line) => line)
				.map((line) => `" ${line} " `)
				.join('+\n');
		}
	};
</script>

<div class="flex">
	<div class="mr-2 whitespace-nowrap dark:text-white">java 17</div>
	<Toggle bind:checked={javaToggle} />
	<div class="whitespace-nowrap dark:text-white">java 8</div>
</div>
<div
	class="grid items-center gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
	<div class="mb-3">
		<Label class="mb-2 block">table name</Label>
		<Input bind:value={tableName} />
	</div>
</div>
<div
	class="grid items-center gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2">
	<div class="mb-4">
		<Label class="mb-2 block">column</Label>
		<Textarea {rows} bind:value={column} />
	</div>
</div>
<div
	class="grid items-center gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
	<div class="mb-3">
		<Label class="mb-2 block">primary key</Label>
		<Input bind:value={primaryKey} />
	</div>
</div>
<div class="grid grid-cols-2 items-center gap-4">
	<div class="mb-3">
		<Label class="mb-2 block">result</Label>
		<Textarea bind:value={result} {rows} readonly />
	</div>
</div>
<div class="flex items-center gap-2">
	<Button onclick={handleClick}>轉換</Button>
	<Button pill={true} class="p-2!"><Copy text={result} /></Button>
</div>

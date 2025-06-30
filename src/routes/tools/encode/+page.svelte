<script lang="ts">
	import { Button, Input, Label, Select, Textarea, Toggle } from 'flowbite-svelte';
	import { SortHorizontalOutline } from 'flowbite-svelte-icons';
	import * as base64 from 'js-base64';
	import json5 from 'json5';

	const rows: number = 40;
	let content: string = '';
	let target: string = '';
	let pattern: string = '0x|3PD0B5010001|40.10Y19.013';

	$: if (content) {
		content = content.trim();
		target = JSON.stringify(encodeBody(json5.parse(content)), null, '\t') || '';
	}

	const encodingText = (text) => {
		// 你自己的 base64 encode 方法
		return base64.encode(text);
	};

	const encodeBody = (body, path = '', encodedPaths = null) => {
		const isObject = (data) => data && typeof data === 'object' && !Array.isArray(data);
		const paths = encodedPaths === null ? [] : encodedPaths;
		const valuePattern = new RegExp(pattern, 'g');

		if (typeof body === 'string') {
			if (valuePattern.test(body)) {
				// 字串直接 encode
				paths.push(path);
				return encodingText(body);
			}
			return body;
		}

		if (Array.isArray(body)) {
			return body.map((item, idx) => {
				const currentPath = `${path}[${idx}]`;
				// 遞迴處理每個元素
				return encodeBody(item, currentPath, paths);
			});
		}

		if (isObject(body)) {
			for (const key in body) {
				if (Object.prototype.hasOwnProperty.call(body, key)) {
					const currentPath = path ? `${path}.${key}` : key;
					body[key] = encodeBody(body[key], currentPath, paths);
				}
			}
			// 只在最外層加 $decode
			if (path === '' && paths.length > 0) {
				body.$decode = paths;
			}
			return body;
		}

		// 其他型別直接回傳
		return body;
	};
</script>

<div class="flex w-full items-center justify-center gap-2">
	<div class="flex items-center gap-2">
		<Input placeholder="輸入正則表達式" bind:value={pattern} />
	</div>
</div>
<div class="grid w-full grid-cols-2 items-center gap-2">
	<Textarea placeholder="任意格式非加密文" bind:value={content} {rows} />
	<Textarea placeholder="密文" bind:value={target} {rows} />
</div>

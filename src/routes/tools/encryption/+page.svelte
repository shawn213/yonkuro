<script>
	import { Button, Input, Label, Select, Textarea, Toggle } from 'flowbite-svelte';
	import { Base64 } from 'js-base64';
	import json5 from 'json5';

	let body = '';
	let target = '';
	let regex = '';

	const encodingText = (text) => Base64.encode(text);
	const encodeBody = (body, path = '', encodedPaths = null) => {
		const isObject = (data) => data && typeof data === 'object' && !Array.isArray(data);

		if (encodedPaths === null) {
			encodedPaths = [];
		}

		// 判斷 value 是否包含這些字串的正規表達式
		const valuePattern = new RegExp(regex);

		for (const key in body) {
			if (Object.prototype.hasOwnProperty.call(body, key)) {
				const value = body[key];
				const currentPath = path ? `${path}.${key}` : key;

				if (typeof value === 'string' && valuePattern.test(value)) {
					body[key] = encodingText(value);
					encodedPaths.push(currentPath);
				} else if (
					Array.isArray(value) &&
					value.some((item) => typeof item === 'string' && valuePattern.test(item))
				) {
					body[key] = value.map((item) =>
						typeof item === 'string' && valuePattern.test(item) ? encodingText(item) : item
					);
					encodedPaths.push(currentPath);
				} else if (isObject(value)) {
					encodeBody(value, currentPath, encodedPaths);
				} else if (Array.isArray(value)) {
					body[key] = value.map((item, index) => {
						if (isObject(item)) {
							return encodeBody(item, `${currentPath}[${index}]`, encodedPaths);
						} else {
							return item;
						}
					});
				}
			}
		}

		if (path === '') {
			body.$decode = encodedPaths;
		}

		return body;
	};
</script>

<div class="grid w-full grid-cols-2 items-center gap-2">
	<Textarea placeholder="請輸入專案代碼（小寫）" bind:value={body} rows={40} />
	<Textarea placeholder="請輸入專案代碼（小寫）" bind:value={target} rows={40} />
</div>
<div class="mb-2 flex justify-center">
	<Input type="text" bind:value={regex} class="w-full max-w-md" />
</div>
<div class="mb-2 flex justify-center">
	<Button onclick={() => (target = JSON.stringify(encodeBody(json5.parse(body)), null, '\t'))}>
		測試
	</Button>
</div>

<script lang="ts">
	import { Button, Input, Label, Select, Textarea, Toggle } from 'flowbite-svelte';
	import { SortHorizontalOutline } from 'flowbite-svelte-icons';
	import { Base64 } from 'js-base64';
	import { jwtDecode } from 'jwt-decode';
	import json5 from 'json5';
	import Rabbit from 'crypto-js/rabbit';
	import encUtf8 from 'crypto-js/enc-utf8';

	const rows: number = 20;
	const encrypts = [
		{ value: 'default', name: 'default' },
		{ value: 'base64', name: 'base64' },
		{ value: 'jwt', name: 'jwt' },
		{ value: 'sha1', name: 'sha1' }
	];
	let toggle: boolean = true;
	let content: string = '';
	let target: string = '';
	let key: string = '';
	let selected: string = 'default';

	let buttonText: string = '解密';
	let contentText = '密文';
	let disabled = false;
	let keyShow = true;
	$: switch (selected) {
		case 'jwt':
			toggle = false;
			disabled = true;
			keyShow = false;
			break;
		case 'sha1':
			toggle = false;
			disabled = true;
			keyShow = false;
			break;
		case 'base64':
			disabled = false;
			keyShow = false;
			break;
		default:
			disabled = false;
			keyShow = true;
			break;
	}
	$: if (toggle) {
		buttonText = 'Encryption';
		contentText = 'Original';
	} else {
		buttonText = 'Decryption';
		contentText = 'Ciphertext';
	}

	const byteToHex = (byte) => {
		return ('0' + byte.toString(16)).slice(-2);
	};

	const generateId = (len = 40) => {
		var arr = new Uint8Array(len / 2);
		window.crypto.getRandomValues(arr);
		return Array.from(arr, byteToHex).join('');
	};

	const handleClick = () => {
		if (!toggle) {
			switch (selected) {
				case 'base64':
					target = Base64.atob(content);
					break;
				case 'jwt':
					target = JSON.stringify(jwtDecode(content), null, '\t');
					break;
				case 'sha1':
					target = generateId();
					break;
				default:
					const decrypted = Rabbit.decrypt(content, key);
					target = decrypted.toString(encUtf8);
					break;
			}
		} else {
			switch (selected) {
				case 'base64':
					target = Base64.btoa(content);
					break;
				case 'jwt':
					target = JSON.stringify(jwtDecode(content), null, '\t');
					break;
				case 'sha1':
					target = generateId();
					break;
				default:
					target = Rabbit.encrypt(content, key).toString();
					break;
			}
		}
	};
	const handleClickToggle = () => {
		[content, target] = [target, content];
	};
</script>

<div class="grid w-full grid-cols-2 items-center gap-2">
	<div class="flex items-center">
		<Label for="toggle" class="mr-2 text-right">Switch</Label>
		<Toggle bind:checked={toggle} {disabled} color={disabled ? 'gray' : 'green'} />
		<Label for="encoding" class="mr-2 text-right">Encryption</Label>
		<Select id="encoding" bind:value={selected} class="w-full max-w-md" items={encrypts} />
	</div>
	<Label for="encoding" class="text-right">.</Label>
	<Label for="source">{contentText}</Label>
	<Label for="target">Result</Label>
	<Textarea placeholder="任意格式非加密文" bind:value={content} {rows} />
	<Textarea placeholder="密文" bind:value={target} {rows} />
</div>
{#if keyShow}
	<div class="mb-2 flex justify-center">
		<Input type="text" bind:value={key} class="w-full max-w-md" />
	</div>
{/if}
<div class="mb-2 flex justify-center">
	<Button onclick={handleClickToggle} pill={true} class="p-2!"><SortHorizontalOutline /></Button>
</div>
<div class="mb-2 flex justify-center">
	<Button onclick={handleClick}>{buttonText}</Button>
</div>

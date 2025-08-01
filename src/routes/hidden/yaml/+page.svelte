<script lang="ts">
	import { Label, Textarea, Button, Toggle } from 'flowbite-svelte';
	import { AngleRightOutline, AngleLeftOutline } from 'flowbite-svelte-icons';
	import yaml from 'yaml';
	import json5 from 'json5';
	import Copy from '$lib/components/Copy.svelte';
	import { flattenObject, unflattenObject } from '$lib/utils/flatten';

	let inputYaml: string = '';
	let outputJson: string = '';
	const rows: number = 20;
	let toggle: boolean = true;

	const handleClickToYaml = () => {
		try {
			if (toggle) {
				outputJson = JSON.stringify(flattenObject(yaml.parse(inputYaml)), null, '	');
			} else {
				outputJson = JSON.stringify(unflattenObject(yaml.parse(inputYaml)), null, '	 ');
			}
		} catch (error) {
			outputJson = `Error parsing YAML: ${error.message}`;
		}
	};

	const handleClickToJson = () => {
		try {
			if (toggle) {
				inputYaml = yaml.stringify(flattenObject(json5.parse(outputJson)));
			} else {
				inputYaml = yaml.stringify(unflattenObject(json5.parse(outputJson)));
			}
		} catch (error) {
			inputYaml = `Error parsing YAML: ${error.message}`;
		}
	};
</script>

<div class="item-center mt-2 flex justify-center gap-2">
	<Label>結構</Label>
	<Toggle bind:checked={toggle} class="mb-4" />
	<Label>攤平</Label>
</div>
<div class="grid grid-cols-2 gap-2">
	<div class="flex flex-col">
		<Label for="yaml-input" class="text-sm font-medium">Yaml</Label>
		<Textarea bind:value={inputYaml} {rows}></Textarea>
	</div>
	<div class="flex flex-col">
		<Label for="json-output" class="text-sm font-medium">Json</Label>
		<Textarea bind:value={outputJson} {rows}></Textarea>
	</div>
	<div class="flex justify-between px-10">
		<Button pill={true} class="p-2!"><Copy text={inputYaml} /></Button>
		<Button onclick={handleClickToYaml} pill={true} class="p-2!"><AngleRightOutline /></Button>
	</div>
	<div class="flex justify-between px-10">
		<Button onclick={handleClickToJson} pill={true} class="p-2!"><AngleLeftOutline /></Button>
		<Button pill={true} class="p-2!"><Copy text={outputJson} /></Button>
	</div>
</div>

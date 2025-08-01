<script lang="ts">
	import { Label, Textarea, Button } from 'flowbite-svelte';
	import {
		AngleRightOutline,
		AngleLeftOutline,
		CompressOutline,
		CodeMergeOutline
	} from 'flowbite-svelte-icons';
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import _ from 'lodash';
	import { JSONEditor } from 'svelte-jsoneditor';
	import Copy from '$lib/components/Copy.svelte';

	const rows: number = 12;
	let minify = '';
	let newContent = '';
	let target = undefined;
	const handleClick = () => {
		target = {
			text: minify,
			json: JSON.parse(minify)
		};
	};

	const handleChange = (flag) => {
		switch (flag) {
			case 'minify':
				minify = JSON.stringify(target.json, null, 0);
				break;
			default:
				minify = JSON.stringify(target.json, null, '  ');
				break;
		}
	};

	const handleMerge = () => {
		if (newContent) {
			const newJson = JSON.parse(newContent);
			const mergedJson = _.merge(JSON.parse(minify), newJson, JSON.parse(minify));
			target = {
				text: JSON.stringify(mergedJson, null, '  '),
				json: mergedJson
			};
		}
	};
</script>

<div class="mx-2 grid grid-cols-10 items-center gap-1">
	<div class="col-span-5">
		<Label>minify</Label>
	</div>
	<div class="col-span-5 text-right">
		<Label>Format</Label>
	</div>
</div>
<Splitpanes class="mx-2 h-133">
	<Pane minSize={30}>
		<div>
			<Textarea placeholder={JSON.stringify({ key: 'test' })} bind:value={minify} {rows} />
			<Textarea placeholder={JSON.stringify({ key: 'test' })} bind:value={newContent} {rows} />
		</div>
	</Pane>
	<Pane minSize={30}>
		<div class="jse-theme-dark h-133">
			<JSONEditor bind:content={target} mainMenuBar={false} navigationBar={false} />
		</div>
	</Pane>
</Splitpanes>
<div class="mx-2 grid grid-cols-2 items-center gap-1">
	<div class="mt-2 flex justify-center gap-2">
		<Button pill={true} class="p-2!"><Copy text={minify} /></Button>
		<Button pill={true} class="p-2!" onclick={handleMerge}><CodeMergeOutline /></Button>
		<Button onclick={handleClick} pill={true} class="p-2!"><AngleRightOutline /></Button>
	</div>
	<div class="mt-2 flex justify-center gap-2">
		<Button onclick={() => handleChange('')} pill={true} class="p-2!">
			<AngleLeftOutline />
		</Button>
		<Button onclick={() => handleChange('minify')} pill={true} class="p-2!">
			<CompressOutline />
		</Button>
	</div>
</div>

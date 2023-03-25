<script>
	import {readable, writable} from 'svelte/store'
	import { Timeline, TimelineItem, Button, ButtonGroup, Input } from 'flowbite-svelte';
	import {api} from "../service";
	import {ContentType, StoredContent} from "../rpc/api";
	import AudioRecorder from "../components/AudioRecorder.svelte";
	import {clips} from "../store/content";
	import {onMount} from "svelte";
    import { Select, Label } from 'flowbite-svelte';

	const inputTypeLookup = {
		"text": ContentType.TEXT,
		"audio": ContentType.AUDIO,
		"url": ContentType.URL,
	}

	let selected;
	let inputTypes = [
		{value:"text", name: "Text"},
		{value:"audio", name: "Audio"},
		{value:"url", name: "URL"},
	]

	let media = []
	let mediaRecorder = null;
	let recording = writable(false);
	let content = writable('');
	const storedContent = writable([]);

	const load = async () => {
		try {
			const results = await api.Search({
				query: ''
			});
			let content = [];
			results.storedContent.forEach((item) => {
				let c = {
					type: item.content.type,
					data: item.content.data,
					normal: item.normalized ? item.normalized.data : undefined,
					createdAt: item.createdAt,
				};

				if (item.content.type === ContentType.AUDIO) {
					console.log(item.content.data);
					const blob = new Blob(item.content.data, { type: "audio/mp3" });
					c.url = window.URL.createObjectURL(blob);
					console.log(c.url)
				}

				content.push(c);
			});
			content = content.reverse();
			console.log(content);
			storedContent.set(content);
		} catch (e) {
			console.error(e);
		}
	}

	const encoder = new TextEncoder()

	onMount(async () => {
		await load();
	});

	async function saveContent(){
		try {
			const contentID = await api.Save({
				data: encoder.encode($content),
				type: selected === "text" ? ContentType.TEXT : ContentType.URL,
				metadata: {},
				createdAt: new Date().toTimeString()
			});
			console.log(contentID);
			await load();
		} catch (e) {
			console.error(e);
		}
	}

	async function saveRecording(){
		try {
			const clip = $clips[0];
			const contentID = await api.Save({
				data: clip.content,
				type: ContentType.AUDIO,
				metadata: {},
				createdAt: new Date().toTimeString()
			});
			console.log(contentID);
			await load();
		} catch (e) {
			console.error(e);
		}
	}
</script>

<section>
	<div class="grid grid-cols-4 gap-4 mb-4">
		<div class="col-span-1">
			<Label for="countries">Select an option</Label>
			<Select id="countries" class="mt-2" bind:value={selected} placeholder="">
				{#each inputTypes as {value, name}}
					<option {value}>{name}</option>
				{/each}
			</Select>
		</div>
		<div class="col-span-3">
			<Label for="content-input">Content</Label>
			<ButtonGroup class="w-full mt-2">
				<Input id="content-input" type="text" bind:value={$content} />
				<Button color="blue" on:click={saveContent}>Save</Button>
			</ButtonGroup>
		</div>
	</div>

	{#if selected === "audio"}
		<AudioRecorder />
		<Button color="blue" on:click={saveRecording}>Save</Button>
	{/if}

	<Timeline>
		{#each $storedContent as item}
			{#if item.type === ContentType.TEXT}
				<TimelineItem title="text" date="March 2022">
					<p class="text-base font-normal text-gray-500 dark:text-gray-400">
						{new TextDecoder().decode(item.data)}
					</p>
				</TimelineItem>
			{:else if item.type === ContentType.AUDIO}
				<TimelineItem title="Audio" date="March 2022">
					<p class="text-base font-normal text-gray-500 dark:text-gray-400">
						{#if item.normal}
							{item.normal}
						{:else}
							No Normalization
						{/if}
						<audio src={item.url} controls/>
					</p>
				</TimelineItem>
			{:else if item.type === ContentType.URL}
				<TimelineItem title="URL" date="March 2022">
					<p>
						<a href="{new TextDecoder().decode(item.data)}">{new TextDecoder().decode(item.data)}</a>
					</p>
					<p class="text-base font-normal text-gray-500 dark:text-gray-400">
						{#if item.normal}
							{item.normal}
						{:else}
							No Normalization
						{/if}
					</p>
				</TimelineItem>
			{/if}
		{/each}
	</Timeline>
</section>

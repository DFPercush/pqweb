<script lang="ts">

	import {onMount, createEventDispatcher} from "svelte";
	import {settings, type PQVars, IsBuiltInUnit} from "./pq";
	// import type HistoryItem from "./App.svelte";
	import type { HistoryItem } from "./pq";
	import imgBack from "./assets/back.svg";
    import CopyButton from "./CopyButton.svelte";

	export let visible: boolean = false;
	export function show(visibility:boolean=true)
	{
		visible = visibility;
		if (visible)
		{
			Reload();
		}
	}
	export function hide(){ show(false); }
	export function toggleVisibility() { show(!visible); }


	let txt = "";

	//export let settings: Settings;
	export let vars: PQVars;
	export let history: HistoryItem[];

	let dispatch = createEventDispatcher();

	type ExportData =
	{
		settings: any;
		vars: PQVars;
		history: HistoryItem[];
	}

	onMount(()=>{
		Reload();
	})

	function Reload()
	{
		let customVars: PQVars = {};
		for (var k in vars)
		{
			if (!IsBuiltInUnit(k))
			{
				customVars[k] = vars[k];
			}
		}
		let j:ExportData =
		{
			settings: settings,
			vars: customVars,
			history: history
		};
		txt = JSON.stringify(j, function(k,v){
				//if (v instanceof Array) { return JSON.stringify(v); }
				if (k === "dim") { return JSON.stringify(v); }
				return v;
			} , 2)
		 	.replace(/\"\[/g, '[')
        	.replace(/\]\"/g,']');
	}


	function Import()
	{
		let j = JSON.parse(txt);
		let detail = {};
		if ("settings" in j)
		{
			for (var k in j.settings)
			{
				settings[k] = j.settings[k];
			}
			//settings = j.settings;
			settings.save();
			//localStorage.setItem("settings", JSON.stringify(this.settings));
			//settings.reload();
			detail["settings"] = true;
		}
		if ("history" in j)
		{
			history = j.history;
			let histJson = JSON.stringify(this.history);
			//console.log("Saving history to local storage: ", histJson);
			localStorage.setItem("history", histJson);
			detail["history"] = true;
		}
		if ("vars" in j)
		{
			vars = j.vars;
			let jsonVars = JSON.stringify(vars);
			localStorage.setItem("saved-vars", jsonVars);
			detail["vars"] = true;
		}
		dispatch("import", detail);
		hide();
	}

</script>

{#if visible}

<div class="export-main">
	<div class="left topbar">
		<button class="back blend-bg" on:click={hide}>
			<img class="svg-fg" src={imgBack} alt="Back">
		</button>
		<h2>Import / Export</h2>
	</div>
	<label for="maintextarea" class="sr-only">Data:</label>
	<textarea name="maintextarea" id="maintextarea" rows="20" bind:value={txt} aria-hidden="true"></textarea>
	<div class="buttons">
		<CopyButton text={txt}></CopyButton>
		<button class="clearbutton" on:click={()=>txt=""}>Clear</button>
		<button class="importbutton" on:click={Import}>Import</button>
	</div>
</div>

{/if}

<style lang="scss">
	.export-main {
		z-index: 1;
		position:absolute;
		left: 1em;
		right: 1em;
		bottom: 1em;
		top: 1em;
		background-color: #282828;
		color:silver;
		padding-top: 1em;
		padding-left: 5pt;
		padding-right: 5pt;
		border: 2px solid rgb(128, 184, 229);

		@media (prefers-color-scheme: light) {
			background-color: white;
			color: black;
		}
		
		.topbar {
			margin-bottom: .5em;
			margin-left: 1em;
			button {
				margin-right: 2em;
			}
		}

		textarea {
			font-size: 1rem;
			width: 95%;
		}

		.buttons > button {
			padding-top: .5em;
			padding-left: 1em;
			padding-right: 1em;
			margin-left: 1em;
			margin-right: 1em;
		}
	}
</style>
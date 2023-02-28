<script lang="ts">
	// import { query_selector_all } from "svelte/internal";
	import {createEventDispatcher} from "svelte";
	import {PQ, type PQVars, Units, type Unit, settings, IsBuiltInUnit, TrimRightZeros} from "./pq";
	import imgBack from "./assets/back.svg";
	import imgRecall from "./assets/recall.svg";
	export let varset: PQVars;

	let wvar : PQ;
	let wstr: string = ""
	let qtyStrShort:string = "";
	let qtyStrLong:string = "";
	let qtyStrRaw: string = "";
	let identicalUnits: Unit[] = [];
	let identicalVars: string[] = [];

	let dispatch = createEventDispatcher();

	function arreq<T>(a:T[], b:T[]): boolean
	{
		if (a.length !== b.length) { return false; }
		for (var i = 0; i < a.length; i++)
		{
			if (a[i] !== b[i]) return false;
		}
		return true;
	}

	function Reload()
	{
		wvar = PQ.parse(wstr, varset);
		let bkLongPref = settings.useLongNames;
		try {
			settings.useLongNames = false;
			qtyStrShort = wvar.prettyPrint(varset);
			settings.useLongNames = true;
			qtyStrLong = wvar.prettyPrint(varset);
			qtyStrRaw = `${TrimRightZeros(wvar.n.toPrecision(16))} [${wvar.dim[0]},${wvar.dim[1]},${wvar.dim[2]},${wvar.dim[3]},${wvar.dim[4]},${wvar.dim[5]}]`;
		}
		catch {}
		settings.useLongNames = bkLongPref;

		identicalUnits = [];
		for (var u of Units)
		{
			if (arreq(u.dim, wvar.dim))
			{
				identicalUnits.push(u);
			}
		}

		identicalVars = [];
		for (var name of Object.keys(varset))
		{
			if (!IsBuiltInUnit(name))
			{
				if (arreq(varset[name].dim, wvar.dim))
				{
					//console.log(name);
					identicalVars.push(name);
				}
			}
		}

		identicalUnits = identicalUnits;
		identicalVars = identicalVars;
	}

	export let visible: boolean = false;
	export function show(s:string)
	{
		wstr = s;
		Reload();
		visible = true;
	}
	export function hide(){ visible = false; }
	export function toggleVisibility() { if (visible) hide(); else show(wstr); }
	


</script>

{#if visible}
	<div class="whatis">
		<div class="header">
			<button on:click={hide} class="blend-bg"><img class="svg-fg" src={imgBack} alt="Back"></button>
			<!-- <div class="flex-spacer"></div> -->
			<!-- <div class="flex-spacer"></div> -->
		</div>
			<!-- <span class="qty">{wstr}</span> -->
		<div class="qty">{qtyStrShort}</div>
		<div class="qty">{qtyStrLong}</div>
		<div class="qty-raw">{qtyStrRaw}</div>
		<div class="dim">
			<div><div>Mass</div></div><div>{wvar.dim[0]}</div>
			<div><div>Distance</div></div><div>{wvar.dim[1]}</div>
			<div><div>Time</div></div><div>{wvar.dim[2]}</div>
			<div><div>Temperature</div></div><div>{wvar.dim[3]}</div>
			<div><div>Electrical Current</div></div><div>{wvar.dim[4]}</div>
			<div><div>Luminous Intensity</div></div><div>{wvar.dim[5]}</div>
		</div>
		<h2>Same as:</h2>
		<div class="identical">
			{#each identicalUnits as u}
				<!-- <div class="identline"> -->
					<div>{TrimRightZeros((wvar.n / u.factor).toPrecision(settings.precision))}</div>
					<div>{u.symbol}</div>
					<div>{u.longNameSingular}</div>
					<div>{u.longNamePlural}</div>
				<!-- </div> -->
			{/each}
		</div>
		<h2>Variables:</h2>
		<!-- {identicalVars.length} -->
		<div class="identical-vars">
			{#each identicalVars as vname}
				<div>{TrimRightZeros((wvar.n / varset[vname].n).toPrecision(settings.precision))}</div>
				<div>{vname}</div>
				<button class="blend-bg" on:click={()=>{dispatch('recall', {name:vname, factor: wvar.n / varset[vname].n}); hide();}}>
					<img class="svg-fg" src={imgRecall} alt="Recall">
				</button>
			{/each}
		</div>
		<button id="close-end" on:click={hide}>Close</button>
	</div>
{/if}

<style lang="scss">

	.whatis {
		position:absolute;
		left:1rem;
		right:1rem;
		top:1rem;
		bottom:1rem;
		z-index:1;
		overflow-y: scroll;
		overflow-x: scroll;
		border: 2px solid lightblue;
		background-color: #282828;
		color:silver;

		@media (prefers-color-scheme: light) {
			background-color: white;
			color:black;
		}


		.header {
			display:flex;
			flex-direction: row;
			margin:1em;
			font-size: 16pt;
		}
		.qty {
			color:lightblue;
			font-size: 16pt;
			@media (prefers-color-scheme: light) {
				//background-color: white;
				color:blue;
			}
		}
		.qty-raw {
			font-size: 10pt;
			color: var(--fg);
		}
		.dim {
			display:grid;
			grid-template-columns: max-content max-content;
			justify-content: center;
			justify-items: center;

			:nth-child(2n + 1) {
				// justify-content: right;
				// justify-items: right;
				// text-align: right;
				// place-items: right;
				justify-self: right;
				margin-bottom: .1em;
				margin-right: .1em;
			}
			:nth-child(2n) {
				justify-content: left;
				justify-items: left;
				margin-left: 1em;
				margin-bottom: .1em;
			}
		}

		.identical {
			display:grid;
			justify-content: center;
			overflow-x:scroll;
			width: max-content;
			padding-left: 1em;
			padding-right: 1em;
			grid-template-columns: max-content max-content max-content max-content;
			&>* {
				// justify-content: left;
				// justify-items: left;
				// justify-self: left;
				// text-align: left;
				// place-content: left;
				// place-items: left;
				margin-left: 5pt
			}
		}

		.identical-vars {
			// background-color: red;
			display:grid;
			grid-template-columns: max-content max-content max-content;
			justify-content: center;
			overflow-x: scroll;
			padding-bottom: .5em;
			&>* {
				margin-left: 5pt;
			}
		}

		#close-end {
			margin: 1em;
		}
	}

</style>
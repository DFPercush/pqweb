<script lang="ts">
	import { query_selector_all } from "svelte/internal";
	import {PQ, type PQVars, Units, type Unit, settings} from "./pq";
	import imgBack from "./assets/back.svg";

	export let varset: PQVars;

	let wvar : PQ;
	let wstr: string = ""
	let identicalUnits: Unit[] = [];

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
		identicalUnits = [];
		for (var u of Units)
		{
			if (arreq(u.dim, wvar.dim))
			{
				identicalUnits.push(u);
			}
		}
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
			<button on:click={hide}><img src={imgBack} alt="Back"></button>
			<div class="flex-spacer"></div>
			<span class="qty">{wstr}</span>
			<div class="flex-spacer"></div>
		</div>
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
					<div>{(wvar.n / u.factor).toPrecision(settings.precision)}</div>
					<div>{u.symbol}</div>
					<div>{u.longNameSingular}</div>
					<div>{u.longNamePlural}</div>
				<!-- </div> -->
			{/each}
		</div>
		<button on:click={hide}>Close</button>
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
		border: 2px solid lightblue;
		background-color: #282828;
		color:silver;

		.header {
			display:flex;
			flex-direction: row;
			margin:1em;
			font-size: 16pt;
			.qty {
				color:lightblue;
				font-size: 22pt;
			}
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
	}

</style>
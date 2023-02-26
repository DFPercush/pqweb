<script lang="ts">

import {createEventDispatcher} from "svelte";
import type {PQVars} from "./pq";
import {PQ, SaveVars, settings, IsBuiltInUnit, isAlpha, isAlphaNumeric} from "./pq";
import imgBack from "./assets/back.svg";
import imgTrash from "./assets/trash.svg"
import imgRecall from "./assets/recall.svg";

export let varset: PQVars;
export let qty: PQ;

let visible:boolean = false;

export function show(visibility:boolean=true)
{
	visible = visibility;
	if (!visible)
	{
		SaveVars(varset);
	}
}
export function hide(){ show(false); }
export function toggleVisibility() { show(!visible); }


$: varnames = Object.keys(varset).sort();
$: qprint = qty.prettyPrint(varset, settings.prefUnits);
let newVarName:string;


let dispatch = createEventDispatcher();

function delVar(name:string)
{
	delete varset[name];
	varset = varset;
}

function addvar()
{
	if (!!newVarName && newVarName.length > 0)
	{
		if (isAlpha(newVarName[0]) && isAlphaNumeric(newVarName))
		{
			varset[newVarName] = qty;
			varset = varset;
			newVarName = "";
		}
		else
		{
			showErr("Invalid name. Letters, numbers, and _ only");
		}
	}
	else
	{
		// TODO: Something better than alert
		//alert("Must give the new variable a name");
	}
}

function typeUnderscore()
{
	let sel = nameInput.selectionStart;
	newVarName = newVarName.substring(0, sel) + "_" + newVarName.substring(sel, newVarName.length);
	nameInput.focus();
	nameInput.setSelectionRange(sel + 1, sel + 1);
}

let nameInput:HTMLInputElement;

function onInputKey(e: KeyboardEvent)
{
	if (e.key == "Enter")
	{
		addvar();
	}
}

let errmsg = "";
let confirmAdd = false;

function showErr(msg:string)
{
	errmsg = msg;
	setTimeout(()=>errmsg="", 5000);
}

function showConfirmAdd()
{
	confirmAdd = true;
	setTimeout(()=>confirmAdd=false, 2000);
}



</script>

{#if visible}
<div class="memory-main">
	<div class="memory-header">
		<button id="back" class="blend-bg" on:click={hide}>
			<img class="svg-fg" src={imgBack} alt="Back">
		</button>
		<div class="flex-spacer"></div>
		<span>Memory</span>
	</div>
	<div class="add">
		<div>New value: <span class="qtydisp">{qprint}</span></div>
		<div id="namebox">
			<label for="newvarname">Name:</label>
			<input type="text" id="newvarname" bind:this={nameInput} bind:value={newVarName} on:keypress={onInputKey}>
			<button id="addvar" class="blend-bg" on:click={addvar}>+</button>
		</div>
		<div>
			<button id="underscore" on:click={typeUnderscore}>_</button>
		</div>
		{#if errmsg}
			<div class="err">{errmsg}</div>
		{/if}
		{#if confirmAdd}
			<div class="confirm">Variable created.</div>
		{/if}
	</div>
	<div class="listvars">
		<div class="saved-vars-title">Saved variables</div>
		{#each varnames as vk}
			{#if !IsBuiltInUnit(vk)}
				<div class="varline">
					<span>
						<span>{vk}</span>
						<button class="recall blend-bg" on:click={()=>{dispatch('recall', vk); hide();}}><img src={imgRecall} alt="Recall" class="svg-fg"></button>
					</span>
					<span>=</span>
					<span>{varset[vk].prettyPrint(varset, settings.prefUnits)}</span>
					<button class="delvar blend-bg" on:click={()=>delVar(vk)}> <img class="svg-fg" src={imgTrash} alt="Delete"> </button>
				</div>
			{/if}
		{/each}
	</div>
</div>
{/if}

<style lang="scss">

.memory-main {
	z-index: 1;
	position: absolute;
	left:10pt;
	right: 10pt;
	top: 10pt;
	bottom: 10pt;
	background-color: #282828;
	color:silver;
	border:1px solid blue;
	padding: .5em;

	@media (prefers-color-scheme: light) {
		background-color: white;
		color: black;
	}

	.memory-header {
		display:flex;
		flex-direction: row;
		justify-content: stretch;
		justify-items: stretch;
	}

	.add {
		//display:flex;
		//flex-direction: row;
		//align-items:baseline;
		
		#namebox {
			display:flex;
			flex-direction: row;
			align-items: center;
			align-content: baseline;
			justify-content: center;
			justify-items: center;
			padding: .5em;
			&>* {
				padding-left: 0.1 em;
				padding-right: 0.1em;
			}
			button#addvar {
				//height: 20pt;
				width: 20pt;
				padding:0;
				margin:0;
				margin-top:-4pt;
				margin-left: 1rem;
				font-size: 24pt;
				font-weight: 700;
				//font-size-adjust: 20pt;
			}
		}
		button#underscore {
			font-size: 20pt;
			font-weight: 700;
			//padding: .1em;
			padding:0;
			padding-left: 1em;
			padding-right: 1em;
			margin:0;
		}
		.qtydisp {
			color:rgb(128, 184, 229);
			font-size: 1.2em;
			@media (prefers-color-scheme: light) {
				color: darkblue;
			}
		}

		button#addvar {
			font-size:30pt;
			color: forestgreen;
		}
	}
	.listvars {
		overflow-y: scroll;

		.saved-vars-title {
			margin: .1em;
		}
		.varline {
			display:grid;
			border-top: 1px solid gray;
			border-bottom: 1px solid gray;
			
			grid-template-columns: 1fr 1em 1fr 2em;
		}
	}
}

</style>
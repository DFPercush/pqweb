
<script lang="ts">
    import { PQ, LoadVars, SaveVars, IsBuiltInUnit, TrimRightZeros, GetUnitFromSymbol, settings } from "./pq";
    //import from "./pq";
	import {onMount} from "svelte";
	import {afterUpdate} from "svelte";
	import RecallButton from "./RecallButton.svelte"
    import CopyButton from "./CopyButton.svelte";
	import imgGear from "./assets/gear.svg";
    import SettingsScreen from "./SettingsScreen.svelte";
    import Memory from "./Memory.svelte";
    import Help from "./Help.svelte";
	import ExportImport from "./ExportImport.svelte";
	import imgCalc from "./assets/calc.svg";
	import type { HistoryItem } from "./pq";
	import imgExport from "./assets/export.svg";
	import kofiLogo from "./assets/kofi_logo_white_stroke_small.webp";
	import imgDonate from "./assets/donate.svg";
    import Whatis from "./Whatis.svelte";

	/*
	TODO:
		. higher level catch
		+ print symbolic + long name in memory qty
		+ whatis show custom vars
		+ insert variable name from memory
		+ save keyboard height
		+ whatis width
		+ whatis button
		+ PQ.prettyPrint()
		+ Save vars
		+ Settings:
			+ rounding
			+ always preferred units
			+ long names
		+ MemPlus
		+ Save/restore history, init iRecall
		+ Export/import
	*/

	//import svelteLogo from './assets/svelte.svg'
	//import Counter from './lib/Counter.svelte'
	//import MathQuillSetup from '../node_modules/svelte-mathquill/MathQuillSetup.svelte'
	//import MathQuillStatic from '../node_modules/svelte-mathquill/MathQuillStatic.svelte'
	//import MathQuill from '../node_modules/svelte-mathquill/MathQuill.svelte'
	//import { MathQuillSetup } from 'svelte-mathquill';
	//import { MathQuill } from "svelte-mathquill";
	
	//let latex : string = "x_0 + 1";
	//let mq : MathQuill;
	//let quillConfig : MathQuillConfig;
	
	

	let History : HistoryItem[] = [];
	let mainQuery : string = "";
	let myVars = LoadVars();

	let mainInput: HTMLInputElement;
	let HistoryElement:HTMLDivElement;
	let settingsScreen: SettingsScreen;
	let memoryScreen: Memory;

	let iRecall = 0;

	let reserveKeyboardSpace = true;

	let ans: PQ = PQ.zero(); // last answer

	let showMem:boolean = false;
	let systemKeyboardAreaFlex: number = 2;

	onMount(()=> {
		////Temporary layout testing
		//mainQuery = "(5km + 3 mi) / 12345 s";
		//submitLine();
		//mainQuery = "1 m";
		//submitLine();
		try
		{
			let testLoadHist = JSON.parse(localStorage.getItem("history"));
			if (Array.isArray(testLoadHist) && testLoadHist.length > 0 &&
				"query" in testLoadHist[0] &&
				"output" in testLoadHist[0]) // skip errors and warning for now i guess
			{
				History = testLoadHist;
				scrollNewHistory = true;
			}
		}
		catch {}
		iRecall = History.length;

		try {
			let nKeyFlex = parseFloat(localStorage.getItem("systemKeyboardAreaFlex"));
			systemKeyboardAreaFlex = nKeyFlex;
		}
		catch {}

		//return ()=>{ localStorage.setItem("history", JSON.stringify(History)); };
	});

	let scrollNewHistory: boolean = false;
	let needFocus: boolean = false;
	let sel = 0;
	afterUpdate(()=>{
		if (scrollNewHistory)
		{
			scrollNewHistory = false;
			setTimeout(()=>
				HistoryElement.scrollTo({top: HistoryElement.scrollHeight}),
				1);
		}
		if (needFocus)
		{
			mainInput.focus();
			if (sel != -1) // { sel = mainInput.selectionStart; }
			{
				//mainInput.selectionStart = sel; //mainInput.value.length;
				mainInput.setSelectionRange(sel, sel);
			}
			needFocus = false;
		}
	});

	function Recall()
	{
		if (History.length === 0) {return;}
		if (iRecall < 0) {iRecall = 0;}
		if (iRecall >= History.length) { iRecall = History.length - 1; }
		mainQuery = History[iRecall].query;
		sel = History[iRecall].query.length;
		needFocus = true;
		//mainInput.focus();
		//mainInput.selectionStart = History[iRecall].query.length;
	}
	
	function onQueryBoxKeyPress(e: KeyboardEvent)
	{
		if (e.key == "Enter")
		{
			submitLine();
		}
	}

	function onMainKeyDown(e: KeyboardEvent)
	{
		if (e.code == "ArrowUp")
		{
			//console.log("up");
			e.preventDefault();
			e.stopImmediatePropagation();
			e.stopPropagation();
			e.cancelBubble = true;
			iRecall--;
			Recall();
			//e.cancelBubble = true;
		}
		else if (e.code == "ArrowDown")
		{
			//console.log("down");
			e.preventDefault();
			e.stopImmediatePropagation();
			e.stopPropagation();
			e.cancelBubble = true;
			iRecall++;
			Recall();
			//e.cancelBubble = true;
		}
	}

	function submitLine()
	{
		// First handle some special commands
		if (mainQuery === "clear") {clear(); return;}
		let iEq = mainQuery.indexOf('=');
		let storeTo = "";
		if (iEq !== -1)
		{
			storeTo = mainQuery.substring(0, iEq).trim();
			mainQuery = mainQuery.substring(iEq + 1, mainQuery.length);
		}

		var qsplit = mainQuery.split(',');
		if (qsplit.length > 2)
		{
			// TODO: Error box UI
			return;
		}
		let q: PQ;
		let qstr:string = "";
		let qerr: string = "";
		let qwarn: string[] = [];
		try
		{
			q = PQ.parse(qsplit[0], myVars);
			ans = q;
			myVars["ans"] = q;
			if (storeTo != "")
			{
				if (IsBuiltInUnit(storeTo))
				{
					// TODO: Show long name
					let u = GetUnitFromSymbol(storeTo);
					let longsing = u.longNameSingular || "";
					let longpl = u.longNamePlural || "";
					qwarn.push(`Can not overwrite built-in unit '${storeTo}' (${longsing}/${longpl})`);
					console.warn("built in overwrite attempt");
				}
				else
				{
					myVars[storeTo] = q;
					SaveVars(myVars);
				}
			}
			let qstrz = q.prettyPrint(myVars, (qsplit[1] || "") + " " + (settings.prefUnits || ""));
			qstr = TrimRightZeros(qstrz);
		}
		catch (err) //: Error)
		{
			qerr = err.message;
		}
		var hi =
		{
			query: mainQuery,
			output: qstr,
			error: qerr,
			warnings: [...qwarn, ...PQ.getWarnings()]
		}; // as HistoryItem;
		//console.log(hi);
		//History.push({"query": mainQuery, "output": PQ.parse(mainQuery, myVars).prettyPrint()});
		History.push(hi);
		//console.log(`History contains ${History.length} items`)
		History = History;
		SaveHistory();
		scrollNewHistory = true;
		if (qerr === "") { mainQuery = ""; }
		//PQ.parse(mainQuery);
		iRecall = History.length;
		mainInput.focus();
	}

	function SaveHistory()
	{
		localStorage.setItem("history", JSON.stringify(History));
	}

	function insert(addText: string)
	{
		let start = mainInput.selectionStart;
		let before = mainQuery.substring(0, start);
		let after = mainQuery.substring(mainInput.selectionEnd, mainQuery.length);
		mainQuery = before + addText + after;
		//mainInput.focus();
		//mainInput.setSelectionRange(start + 1, start + 1);
		sel = start + addText.length;
		needFocus = true;
	}

	function clear()
	{
		History = [];
		mainQuery = "";
		mainInput.focus();
		iRecall = 0;
	}

	function clearEntry()
	{
		mainQuery = "";
		mainInput.focus();
	}

	function memPlus()
	{
		memoryScreen.show();
		//TODO: 
		//alert("Not implemented yet.");
		//showMem = true;
		//mainInput.focus();
		//sel = -1;
		//needFocus = true;
	}

	function handleImport()
	{
		History = History;
		myVars = myVars;
		SaveHistory();
		SaveVars(myVars);
	}

	function saveLayout()
	{
		localStorage.setItem("systemKeyboardAreaFlex", systemKeyboardAreaFlex.toString());
	}

	let helpScreen:Help;
	let exportImportScreen: ExportImport;
	let showFunding = false;
	//let whatisStr: string = "";
	let whatisScreen: Whatis;
	function whatis(s:string)
	{
		//whatisStr = s;
		whatisScreen.show(s);
	}
</script>

<SettingsScreen bind:this={settingsScreen}></SettingsScreen>
<Memory bind:this={memoryScreen} varset={myVars} qty={ans} on:recall={(e)=>insert(e.detail)}></Memory>
<ExportImport bind:this={exportImportScreen} bind:history={History} bind:vars={myVars} on:import={handleImport}></ExportImport>
<Help bind:this={helpScreen}></Help>
<Whatis bind:this={whatisScreen} varset={myVars} on:recall={(e)=>{insert(TrimRightZeros(e.detail.factor.toPrecision(settings.precision))+e.detail.name);}}></Whatis>
<main style="grid-template-rows: 30pt 2fr 120pt {reserveKeyboardSpace ? '3fr' : '20pt'};" on:keydown={onMainKeyDown}>
	<div class="header">
		<div>
			<img src={imgCalc} alt="Calculator Icon">
			<span class="title">
				PQ
			</span>
		</div>
		<div>
			<button
				id="fundingbutton"
				class=""
				on:click={()=>showFunding=!showFunding}
			>
				<img src={imgDonate} alt="Donate"> Donate
			</button>
		</div>
		<div class="spacer"></div>
		<div>
			<button id="help" class="blend-bg" on:click={()=>helpScreen.toggleVisibility()}> ? </button>
		</div>
		<div>
			<button id="exportbutton" class="blend-bg" on:click={()=>exportImportScreen.toggleVisibility()}>
				<img class="svg-fg" src={imgExport} alt="Export and import">
			</button>
		</div>
		<div>
			<button id="settings-button" class="blend-bg" on:click={()=>settingsScreen.toggleVisibility()}>
				<!-- class="blend-bg" -->
				<img class="svg-fg" src={imgGear} alt="Settings">
			</button>
		</div>
	</div>

	{#if showFunding}
	<div class="funding">
		<div>
			<a href="https://ko-fi.com/DFPercush">Buy me a coffee on <img src={kofiLogo} alt="ko-fi.com" height="30pt" width="100pt"></a>
		</div>
		<div>
			<button on:click={()=>showFunding=false}>Close</button>
		</div>
	</div>
	{/if}
	<div class="history" bind:this={HistoryElement}>
		{#each History as hist, ihist}
			<div class="history-item">
				<div class="left">
					<span class="history-query-line">
						<span class="history-query-text">
							{hist.query}
						</span>
						<RecallButton on:click={()=>{iRecall = ihist; Recall();}}></RecallButton>
					</span>
				</div>
				{#if hist.error != ""}
				<div class="history-errbox">
					{hist.error}
				</div>
				{/if}
				{#if hist.warnings.length > 0}
				<div class="history-warnbox">
					{#each hist.warnings as w}
						<div class="warnmsg">
							{w}
						</div>
					{/each}
				</div>
				{/if}
				{#if hist.error == ""}
					<div class="right">
						<div>
							<button on:click={()=>whatis(hist.output)} class="whatis-button blend-bg">?</button>
							<CopyButton text={hist.output} on:clicked={()=>mainInput.focus()}></CopyButton>
							<span class="history-output">
								{hist.output}
							</span>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<div class="input-section">
		<input
			type="text"
			class="main-query"
			bind:this={mainInput}
			bind:value={mainQuery}
			on:keypress={onQueryBoxKeyPress}
		>
			<!-- on:keydown={onQueryBoxKeyDown} -->
		<!-- <button id="btnEquals" tabindex="-1" on:click={submitLine}>=</button> -->
		<div class="keypad">
			<button tabindex="-1" on:click={()=>insert('7')}>7</button>
			<button tabindex="-1" on:click={()=>insert('8')}>8</button>
			<button tabindex="-1" on:click={()=>insert('9')}>9</button>
			
			<button tabindex="-1" on:click={()=>insert('(')}>(</button>
			<button tabindex="-1" on:click={()=>insert(')')}>)</button>
			<button tabindex="-1" on:click={clear}>C</button>
			
			
			<button tabindex="-1" on:click={()=>insert('4')}>4</button>
			<button tabindex="-1" on:click={()=>insert('5')}>5</button>
			<button tabindex="-1" on:click={()=>insert('6')}>6</button>
			
			<button tabindex="-1" on:click={()=>insert('+')}>+</button>
			<button tabindex="-1" on:click={()=>insert('-')}>-</button>
			<button tabindex="-1" on:click={clearEntry}>CE</button>
			
			
			<button tabindex="-1" on:click={()=>insert('1')}>1</button>
			<button tabindex="-1" on:click={()=>insert('2')}>2</button>
			<button tabindex="-1" on:click={()=>insert('3')}>3</button>
			
			<button tabindex="-1" on:click={()=>insert('*')}>*</button>
			<button tabindex="-1" on:click={()=>insert('/')}>/</button>
			<button tabindex="-1" on:click={memPlus}>M</button>
			
			<button tabindex="-1" on:click={()=>insert('0')}>0</button>
			<button tabindex="-1" on:click={()=>insert('.')}>.</button>
			<button tabindex="-1" on:click={()=>insert('_')}>_</button>

			<button tabindex="-1" on:click={()=>insert('^')}>^</button>
			<button tabindex="-1" on:click={()=>insert(',')}>,</button>
			<button tabindex="-1" on:click={submitLine}>=</button>

		</div>

	</div>

	{#if reserveKeyboardSpace}
		<div class="system-keyboard" style="flex: {systemKeyboardAreaFlex}">
			<div>
				<div>
					<!-- <button on:click={()=>systemKeyboardAreaFlex+=.1}>Up</button>
					<button on:click={()=>systemKeyboardAreaFlex-=.1}>Down</button> -->
				</div>
				<div>
					(Mobile device on-screen keyboard area)
				</div>
				<div>
					<button id="collapse-keyboard-reserve" on:click={()=>reserveKeyboardSpace=false}>Collapse</button>
					<input type="range" min=".1" max="4.0" step=".01" bind:value={systemKeyboardAreaFlex} on:change={saveLayout}>
				</div>
			</div>
		</div>
	{/if}

</main>

<style lang="scss">

main {
	position:absolute;
	// display:grid;
	display:flex;
	
	flex-direction: column;
	background-color: #282828;
	left: 0;
	top: 0;
	width: 100vw;
	height: 100vh;
	@media (prefers-color-scheme: light) {
		background-color: white;
		color: black;
	}
}


// button {
// 	background: linear-gradient(0deg, #353535, #707070 65%, #353535);
// 	color: white;
// }

.header {
	//padding: 10pt;
	margin: 5pt;
	display:flex;
	flex-direction: row;
	justify-items: stretch;
	justify-content: stretch;
	align-items: center;
	
	.title {
		font-size: 14pt;
		//font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
	}

	.spacer {
		flex: 1;
	}

	button {
		height: fit-content;
		margin-left: 1rem;
	}

	#help {
		font-size: 20pt;
		font-weight:700;
	}

	#fundingbutton {
		display:flex;
		font-size: 12pt;
		align-items: center;
		//background-image: url("assets/heart.svg");
	}
}

.funding {
	z-index: 1;
	position:absolute;
	left: 10%;
	right:10%;
	top:25pt;
	height: fit-content;
	overflow-y: scroll;
	background-color: #282828;
	border: 2px solid rgb(128, 184, 229);
	color: silver;
	margin-top: 1em;
	margin-bottom: 1em;
	font-size: 14pt;
	padding: 1em;

	@media (prefers-color-scheme: light) {
		background-color: white;
		color:black;
		border: 2px solid black;
	}

}

.history
{
	//position:relative;
	overflow-x: scroll;
	overflow-y: scroll;
	// max-height: calc(100vh * 3 / 5 - 120pt);
	padding-left: 10pt;
	padding-right: 10pt;
	flex: 1;

	.history-item {
		//display:inline;
		//align-items: ;
		border-top: 2px solid gray;

		.whatis-button {
			font-size: 20pt;
			font-weight: 700;
			margin-right: 10pt;
		}
	
		.history-output {
			padding-left: 10pt;
			display: inline-block;
			font-size:16pt;
			color:rgb(128, 184, 229);
			align-self: flex-end;
			@media (prefers-color-scheme: light) {
				color: darkblue;
			}
		}
	}
	
	.history-query-line {
		display: inline-block;
		font-size: 14pt;
		color: silver;
		@media (prefers-color-scheme: light) {
			color:black;
		}
		align-self: flex-start;
	}
	
	.history-warnbox {
		background-color: rgb(64, 64, 0);
		padding: 1pt;
		border: 1px solid #ffff00;
		margin-bottom: 4pt;
		@media (prefers-color-scheme: light) {
			background-color: yellow;
			color: rgb(46, 33, 5);
		}
	}
	
	.warnmsg {
		// color:#a8a848
		color: white;
		font-size: 10pt;
		@media (prefers-color-scheme: light) {
			color: rgb(46, 33, 5);
		}
	}
	
	.history-errbox {
		background-color: darkred;
		border: 1px solid #ff0000;
		padding: 1pt;
		color: white;
		font-size: 12pt;
		margin-bottom: 4pt;
	}
} // history

@media (prefers-color-scheme: light) {
	.history .history-item .history-errbox {
				background-color: rgb(255, 125, 125);
				color: rgb(66, 0, 0);
		}
	}


.input-section {
	//position:relative;
	//top: calc(100vh * 2 / 5);
	//height: calc(100vh / 5);
	//left:0;
	//right: 100vw;
	//top: calc(100vh - 120pt);
	//margin-top: 10pt;
	width: 100vw;
	.main-query {
		width: 95%;
		border: 2px solid silver;
		background-color: #404040;
		color: rgb(219, 219, 219);
		font-size: 16pt;
		padding: .2em;
		@media (prefers-color-scheme: light) {
			border: 2px solid black;
			background-color: white;
			color:black;
		}
	}
}

.keypad
{
	display:grid;
	width: 100%;
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
	& > :nth-child(6n+4) {
		margin-left: 10pt;
	}

	button
	{
		font-size: 16pt;
		font-family: monospace;
		margin: 2px;
		padding: 0;
	}
}

.left {
	display:flex;
	flex-direction: column;
	align-items:flex-start;
}
.right {
	display:flex;
	flex-direction: column;
	align-items:flex-end;
}

.system-keyboard {
	display:flex;
	align-items:center;
	justify-content: center;
	//height: .6vh;

	#collapse-keyboard-reserve {
		margin-right: 4em;
	}
}

</style>

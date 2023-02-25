<script lang="ts">
	import {onMount} from "svelte";
	import {settings} from "./pq";
	import imgBack from "./assets/back.svg";

	//export let precision:number = 6;
	
	onMount(()=>{
		//localStorage.getItem()
	});

	export let visible = false;
	export function show(vis:boolean=true)
	{
		visible = vis;
		if (!visible) { settings.save(); }
	}
	export function hide()
	{
		visible = false;
		settings.save();
	}
	export function toggleVisibility()
	{
		visible = !visible;
		if (!visible) { settings.save(); }
	}


</script>

{#if visible}
	<div id="settings-bg">
		<!-- </div> -->
		<div id="settings-main">
			<div id="settings-header">
				<button id="back" class="blend-bg" on:click={hide}>
					<img src={imgBack} alt="Back">
				</button>
			</div>
			<form action="">
				<label for="precision">Precision</label>
				<div><input id="precision" type="number" bind:value={settings.precision}></div>
				<label for="prefunits">Always prefer these units:</label>
				<div><input type="text" id="prefunits" bind:value={settings.prefUnits}></div>
				<label for="negexp">Output negative exponents</label>
				<div><input type="checkbox" id="negexp" bind:checked={settings.negexp}></div>
				<label for="uselongnames">Long unit names</label>
				<div><input type="checkbox" id="uselongnames" bind:checked={settings.useLongNames}></div>

				<!-- <table>
					<tr>
						<td>
							<label for="precision">Precision</label>
						</td>
						<td>
							<input id="precision" type="number" bind:value={settings.precision}>
						</td>
					</tr>
					<tr>
						<td>
							<label for="uselongnames">Long unit names</label>
						</td>
						<td>
							<input type="checkbox" id="uselongnames" bind:value={settings.useLongNames}>
						</td>
					</tr>
					<tr>
						<td>
							<label for="prefunits">Always prefer these units:</label>
						</td>
						<td>
							<input type="text" id="prefunits" bind:value={settings.prefUnits}>
						</td>
					</tr>
				</table> -->
			</form>
			<button on:click={hide}>Close</button>
		</div>
	</div>
{/if}


<style lang="scss">

// button {
// 	//background: linear-gradient(0deg, #181818, #454545 65%, #181818);
// 	background: linear-gradient(0deg, #282828, #707070 65%, #282828);
// 	padding: .5em;
// }

#settings-bg {
	display:block;
	position:absolute;
	//align-items:flex-end;
	//justify-content: right;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	background-color: #282828;
	color: silver;
	// opacity: .5;
	align-items: center;
	justify-content: center;
	z-index: 1;
}

#settings-header {
	display:flex;
	justify-content: left;
	position:sticky;
}

#settings-main {
	//z-index: 1;
	display: block;
	position: static;
	// border: 2px solid red;
	// background-color: rgba(8, 75, 41, 255);
	margin: 0;
	padding: 10pt;
	// 	opacity:100;
	font-size: 1rem;

	form {
		display:grid;
		overflow-y: scroll;

		//flex-direction: column;
		grid-template-columns: 1fr 1fr;
		
		:nth-child(2n+1) {
			justify-content: right;
			justify-self: right;
		}
		:nth-child(2n) {
			justify-content: left;
			justify-self: left;
			margin-left: 10pt;
		}

		& > * {
			margin-top: 5pt;
			margin-bottom: 5pt;
		}

		input {
			font-size: 1rem;
			padding: .1rem;
		}

		// tr {
		// 	border-top: 1px solid cyan;
		// 	border-bottom: 1px solid cyan;
		// 	margin-top: 0;
		// 	margin-bottom: 0;
		// 	padding-top: 5pt;
		// 	padding-bottom: 5pt;
		// }
		// tr > td:nth-child(1) {
		// 	justify-content: right;
		// }
		// tr > td:nth-child(2) {
		// 	justify-content: left;
		// }
	}
}

</style>
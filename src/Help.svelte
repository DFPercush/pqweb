<script lang="ts">

export let visible = false;
export function show(visibility:boolean=true)
{
	visible = visibility;
}
export function hide() {show(false);}
export function toggleVisibility(){show(!visible);}

</script>


{#if visible}
<div id="help-main">
	<div id="topbar">
		<span>PQ Help</span>
		<span class="flex-spacer"></span>
		<button class="close" on:click={hide}>X</button>
	</div>
	<tr>
		HELP! I need to write a document!<br>
		... Sorry, this is kind of the last thing to be developed. More will be coming.
		
		TODO:
			. Up/down to recall history
	</tr>
	
</div>
{/if}

<style lang="scss">

#help-main {
	position:absolute;
	top:0;
	right:0;
	left:0;
	bottom:0;
	overflow-y: scroll;
	padding: .5rem;
	background-color: #282828;
	color:silver;
	z-index:1;

	@media (prefers-color-scheme: light) {
		background-color: white;
		color: black;
	}

	#topbar {
		display:flex;
		flex-direction: row;
		justify-content: stretch;
		position:sticky;
		.close {
			font-size: 20pt;
			font-weight: 700;
		}
	}
}

</style>
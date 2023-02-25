<script lang="ts">
	import imgCopy from "./assets/copy.svg";
	import {createEventDispatcher} from "svelte";

	export let text:string = "";
	const dispatch = createEventDispatcher();

	let showNotice = false;

	function copy()
	{
		navigator.clipboard.writeText(text);
		showNotice = true;
		setTimeout(()=>showNotice = false, 1500);
		dispatch("clicked", "copy");
	}
</script>

<span>
	{#if showNotice}
	Copied!
	{/if}
	<button class="blend-bg" on:click={copy}>
		<img src={imgCopy} alt="Copy" tabindex="-1">
	</button>
</span>


<!-- <div class="copied-notice" style={showNotice ? 'display:block' : 'display:none'}>
	Copied text.
</div> -->

<style lang="scss">

	// .copied-notice {
	// 	position: absolute;
	// 	width:max-content;
	// 	height: max-content;
	// 	left: calc(100vw / 2 - width / 2);
	// 	top: calc(100vh / 2 - height / 2);
	// }

</style>
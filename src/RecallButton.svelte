<script lang="ts">
	import {createEventDispatcher} from 'svelte';
	import imgRecall from './assets/recall.svg';
	
	//eventDispatcher() {}
	const dispatch = createEventDispatcher();

</script>



<button class="blend-bg" tabindex="-1" on:click={()=>dispatch('click', "recall")}>
	<img class="svg-fg" src={imgRecall} alt="Recall" tabindex="-1">
</button>

<style lang="scss">

</style>
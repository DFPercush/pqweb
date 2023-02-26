<script lang="ts">
    import App from "./App.svelte";
	import imgBack from "./assets/back.svg";

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
		<!-- <span>PQ Help</span> -->
		<!-- <span class="flex-spacer"></span> -->
		<button class="close blend-bg" on:click={hide}><img class="svg-fg" src={imgBack} alt="Back"></button>
	</div>
<div id="maintext">
<h2>Layout</h2>
<p>
	First, let's get comfortable.
	You may notice a slider in the bottom half of the screen that says
	"mobile device on screen keyboard area". The height of this area
	can be adjusted, or eliminated entirely via the "collapse" button.
	This allows you to position the keypad in a convenient location
	for your device, so you can keep your system keyboard on letter
	mode and use the numbers and symbols provided. This setting
	will be saved when you reload the page, so go ahead and take a minute to
	get it just right.
</p>
<p>
	This app also supports dark and light modes via your browser's settings.
This can be found on Chromium-like browsers under settings, appearance, theme.
</p>

<h2>Crash course by example:</h2>
Type or paste the following into the calculator:
<pre>5ft+7in</pre>
It gives you meters. Great, but what if you want cm?
<pre>5ft+7in, cm</pre>
	
<p>
	Add a comma plus your preferred units to specify what you want.
	Units after the comma should only be separated by spaces.
</p>

<p>
	There is also a setting (the gear in the top right) for
	"always preferred units" if you get tired of typing ", cm"
	all the time. But anything you type in the line with a comma
	will override this setting.
</p>

<pre>100 m / 12.5 s, mph</pre>

You get the idea. But let's throw a curve ball.

<pre>50 ft lb * 2700 rpm</pre>

<p>
	... Whoa, that's a lot of symbols. Is that right?
	We can check if there are any meaningful units with
	the question mark symbol next to the answer.
</p>

<p>
	D'oh, we need to use pounds of force, not pounds of weight! (i.e. mass)
	In this program force-pounds have the symbol lbf.
</p>
	
<pre>50 ft lbf * 2700 rpm, hp</pre>

Now that's more like it.

<p>
	There may be several units like that. Check that question
	mark any time you're not sure. You can see all available
	units of, say, force, by entering "newtons" and checking
	that page.
</p>


<h2>Memory and Custom Variabes</h2>
<p>
	There is a memory button "M" on the keypad. You can hit that 
	to manage your saved variables and create new ones from the
	previous answer.
</p>

<p>
	To store the last answer as a variable, type its name into the box at the top
	and hit the green + button.
</p>
<p>
	To insert one of these variables into your input, tap the
	recall icon next to its name, or just type it in manually.
</p>


<p>
	You can also use the equals sign = to create a variable directly from the text prompt.
</p>
<pre>
earth_gravity = 9.81 m/s^2
</pre>
<p>
	This is the only time = should appear in your formula.
This program is an expression evaluator, not an algebraic solver.
</p>

<p>
	The special variable <em>ans</em> always refers to the last answer.
You can use <em>ans</em> to further refine your statement.
</p>


<h2>History</h2>
<p>
	On desktop devices, you can hit the up and down arrows to scroll through
	previous entries if you want to modify or run them again. On mobile devices,
	this can be done by tapping the reload icon next to each history entry on the left.
</p>
<p>
	There is a "copy to clipboard" button next to the output in the history list.
This may or may not work depending on your browser and OS. Some mobile devices
may disable this feature for security reasons.
</p>
<p>
	Tapping the "C" or "Clear" button clears the history. But if you accidentally
hit it by mistake, don't worry! Just refresh the page and your history will come back.
Once you enter the next calculation though, it will start over.
</p>
<p>
	"CE" or "Clear Entry" clears your current input box and does not erase any history.
</p>

<h2>Saving and exporting</h2>
<p>
	The button at the top right with the up-facing arrow is the export page. Here you can 
	extract the program's data and transfer it to a file on your hard drive, an email, or
	any other form of permanent storage. The program stores its data in your browser's
	local storage, so as long as you're on the same device, and the same browser, everything
	will be preserved. But here you can transfer your settings, history, and variables to another
	device. To back up your data, either hit the copy-to-clipboard button, or "select all"
	in the text box, copy and paste into a text file, message, etc. To import data, tap "clear",
	paste one of those backups into the box, and tap "Import."
</p>

<h2>Links</h2>
<p>

	To follow the latest developments, report bugs, or request features, the source code to this project is at
	<a href="https://github.com/DFPercush/pqweb">https://github.com/DFPercush/pqweb</a>
</p>
<p>
	If you would like to feed the programmer, you can buy me a coffee on <a href="https://ko-fi.com/DFPercush">Ko-Fi</a>
</p>
<p>
	This project is powered by <a href="https://svelte.dev/">Svelte</a>.
</p>
</div> <!-- text -->
</div> <!-- help-main -->
{/if}

<style lang="scss">

#help-main {
	position:absolute;
	top:0;
	left:0;
	right:0;
	bottom:0;
	// width: 100vw;
	// height: 100vh;
	// overflow-y: scroll;
	padding: .5rem;
	background-color: #282828;
	color:silver;
	font-size: 12pt;
	justify-content: left;
	justify-self: left;
	text-align: left;
	z-index:1;

	@media (prefers-color-scheme: light) {
		background-color: white;
		color: black;
	}

	#maintext {
		overflow-y: scroll;
	}

	pre {
		justify-content: left;
		justify-self:left;
		place-content: left;
		text-align: left;
		width: 100%;
	}

	#topbar {
		//display:block;
		//flex-direction: row;
		//justify-content: stretch;
		position:sticky;
		// position: absolute;
		.close {
			font-size: 20pt;
			font-weight: 700;
		}
	}
}

</style>
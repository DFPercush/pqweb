
<script> // lang="typescript">

	//import {PQ, ASTNode, CharClass} from './pq';
	import {PQ, CharClass} from './pq';

	let varNames = []; //: string[] = [];

	function extractVarNames(n, names) //n: ASTNode, names: string[])
	{
		if (n.ty == CharClass.SYMBOL)
		{
			names.push(n.text);
		}
		for (var i = 0; i < n.sub.length; i++)
		{
			extractVarNames(n.sub[i], names);
		}
	}

</script>

<style lang="scss">

</style>


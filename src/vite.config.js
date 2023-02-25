export default function defineConfig({ command, mode, ssrBuild }) {
	if (command === 'serve' || command === "")
	{
		return
		{
			// dev specific config
			
		}
	} else {
		// command === 'build'
		// build specific config
		return
		{
		}
	}
}

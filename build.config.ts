import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig([
	{
		entries: [
			{
				input: 'src/builds/module',
				name: 'module',
			},
		],
		clean: true,
		declaration: true,
		rollup: {
			emitCJS: true,
			output: {
				exports: 'named',
			},
		},
	},
	{
		entries: ['src/builds/cdn'],
		clean: true,
		rollup: {
			output: {
				name: 'LazyScripts',
				format: 'umd',
				entryFileNames: 'cdn.js',
			},
		},
	},
	{
		entries: ['src/builds/cdn'],
		clean: true,
		rollup: {
			esbuild: {
				minify: true,
			},
			output: {
				name: 'LazyScripts',
				format: 'umd',
				entryFileNames: 'cdn.min.js',
			},
		},
	},
]);

const path = require('path');

const production = process.env.NODE_ENV === 'production';

module.exports = {
	entry: './assets/server/main.ts',
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'server.js'
	},
	node: {
		__dirname: false,
		__filename: false
	},
	resolve: {
		extensions: [ '.ts', '.js', '.json' ]
	},
	target: 'electron-main',
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: 'awesome-typescript-loader'
			},
			{
				test: /\.node?$/,
				use: [
					{
						loader: 'electron-node-loader',
						options: {
							folder: 'scripts',
							prod: production
						}
					}
				]
			}
		]
	},
	mode: (production) ? ('production') : ('development'),
	devtool: (production) ? ('source-map') : (false)
};

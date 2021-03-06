const path = require('path');

const production = process.env.NODE_ENV === 'prod';

function sourcePath(folder) {
  return path.join(__dirname, `../sources/${folder}`);
}

module.exports = {
  entry: './sources/server/main.ts',
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: 'server.js'
  },
  node: {
    __dirname: false,
    __filename: false
  },
  resolve: {
    extensions: [ '.ts', '.js', '.json', '.node' ],
    alias: {
      '@models': sourcePath('models')
    }
  },
  target: 'electron-main',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader'
      },
      {
        test: /\.node?$/,
        use: [
          {
            loader: 'electron-node-loader',
            options: {
              folder: 'modules',
              prod: production
            }
          }
        ]
      },
      {
        type: 'javascript/auto',
        test: /\.mjs$/,
        use: []
      }
    ]
  },
  mode: production ? 'production' : 'development',
  devtool: production ? 'source-map' : 'cheap-module-source-map'
};

module.exports = {
  entry: './src/index.ts',
  output: {
    publicPath: 'yaml-parser/',
    path: __dirname + '/dist',
    libraryTarget: 'umd',
    library: 'yaml-parser',
    filename: 'yaml-parser.js'
  },
  devtool: 'source-map',
  target: 'node',
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".js", ".json"]
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ],
  },
  watch: true
}

module.exports = {
  mode: "production",
  entry: "./index.js",
  output: {
    path: __dirname + "/dist",
    filename: "el_beeswarm.min.js",
    libraryTarget: "var",
    library: "vis",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: true,
  },
};

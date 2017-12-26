var path = require("path")

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js",
    libraryTarget: "commonjs2", // THIS IS THE MOST IMPORTANT LINE! :mindblow: I wasted more than 2 days until realize this was the line most important in all this guide.
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      styles: path.join(__dirname, "/src/styles"),
    },
    modules: [path.resolve(__dirname, "src"), "node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src"),
        exclude: /(node_modules|bower_components|build)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env"],
          },
        },
      },
      {
        use: "ts-loader",
        test: /\.tsx?$/,
        exclude: /node_modules/,
      },
    ],
  },
  externals: {
    react: "commonjs react", // this line is just to use the React dependency of our parent-testing-project instead of using our own React.
  },
}

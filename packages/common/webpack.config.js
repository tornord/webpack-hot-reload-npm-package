const fs = require("fs");
const path = require("path");

const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const packageJson = require("./package.json");

module.exports = (env) => {
  const isLibrary = env.target === "library";
  let filename = `index${isLibrary ? "-library" : ""}`;
  const tsFound = fs.existsSync(path.join(__dirname, "src", `${filename}.tsx`));
  const jsxFound = fs.existsSync(path.join(__dirname, "src", `${filename}.jsx`));
  const startExt = `${tsFound ? "tsx" : jsxFound ? "jsx" : "js"}`;
  console.log(env, `entry=${filename}.${startExt}`, packageJson.name, isLibrary);
  const plugins = [new Dotenv()];
  if (!isLibrary) {
    plugins.push(
      new HtmlWebpackPlugin({
        title: packageJson.title && "Di - Quickshot",
        description: packageJson.description && "Di - Quickshot",
        template: path.join(__dirname, "src", "index.html"),
      })
    );
  }
  // const outputPath = path.resolve(__dirname, "../app/node_modules/common/dist");
  const outputPath = path.resolve(__dirname, env.production ? "dist" : "public")
  console.log(outputPath);
  return {
    mode: env.production ? "production" : "development",
    devtool: env.production ? false : "source-map",
    // snapshot: { managedPaths: [path.join(__dirname, "node_modules/common")] },
    entry: {
      app: path.join(__dirname, "src", `${filename}.${startExt}`),
    },
    target: env.target !== "library" ? "web" : "node",
    resolve: {
      extensions: [".js", ".jsx"],
      fallback: {
        url: require.resolve("url/"),
        path: require.resolve("path-browserify"),
      },
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: "/node_modules",
          use: { loader: "babel-loader", options: { presets: ["@babel/react"] } },
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.s[ca]ss$/i,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          type: "asset/resource",
          generator: { filename: "./images/[hash][ext]" },
        },
        {
          test: /\.(eot|woff2?)$/,
          type: "asset/resource",
          generator: { filename: "./fonts/[name][ext]" },
        },
      ],
    },
    output: {
      path: outputPath,
      clean: env.production ? true : false,
      filename: `${isLibrary ? "index" : `bundle.[hash:8]`}.js`,
      ...(isLibrary ? { library: { type: "commonjs" } } : {}),
    },
    plugins,
    devServer: {
      static: path.resolve(__dirname, "./public"),
    },
    ...(isLibrary ? { externals: { react: { commonjs: "react" } } } : {}),
  };
};

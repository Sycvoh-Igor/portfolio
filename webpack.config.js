global.Promise           = require('bluebird');

var webpack              = require('webpack');
var path                 = require('path');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var autoprefixer         = require('autoprefixer');
var CleanWebpackPlugin   = require('clean-webpack-plugin');

var cssName            = 'css/[name].min.css';
var jsName             = 'js/[name].min.js';

var publicPath         = process.env.NODE_ENV === 'production' ? '/assets/' : 'http://localhost:8050/assets/';
var plugins = [
		new webpack.DefinePlugin({
				'process.env': {
						BROWSER:  JSON.stringify(true),
						NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
				}
		}),
		new MiniCssExtractPlugin({
			filename: cssName,
			chunkFilename: "css/[id].css"
		})
];

if (process.env.NODE_ENV === 'production') {

	plugins.push(
		new CleanWebpackPlugin([ 'public/assets/' ], {
			root: __dirname,
			verbose: true,
			dry: false
		})
	);
}else{
	plugins.push(
		new webpack.LoaderOptionsPlugin({
			debug: true
		})
	);
}

module.exports = {
	mode: process.env.NODE_ENV || 'development',
	context: path.join(__dirname, "src"),
	entry: {
		main: ['babel-polyfill', 'client.js'],
	},
	resolve: {
		modules: [
			path.join(__dirname, "src"),
			"node_modules"
		],
		extensions: ['.js', '.jsx']
	},
	plugins,
	output: {
		path: __dirname + '/public/assets',
		publicPath,
		filename: jsName
	},
	module: {
				rules: [
						{
								test: /\.js$/,
								use: [
									{ loader: "babel-loader" },
									{ loader: "eslint-loader" }
								],
								exclude: [/node_modules/, /public/]
						},
						{
								test: /\.jsx$/,
								use: [
									{ loader: "babel-loader" },
									{ loader: "eslint-loader" }
								],
								exclude: [/node_modules/, /public/]
						},
						{ 
								test: /\.html$/,
								use: [ {
									loader: 'html-loader',
									options: {
										interpolate: true
									}
								}],
						},
						{
								test: /\.css$/,
								use: [
									process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
									"css-loader",
									"postcss-loader",
								]
						},
						{
								test: /\.s[ac]ss$/,
								use: [
									process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
									"css-loader",
									"postcss-loader",
									"sass-loader",
								],
								exclude: [/node_modules/, /public/]
						},
						{
								test: /\.gif$/,
								use: [
									{
										loader: "url-loader",
										options: {
											limit: 100,
											mimetype: "image/gif",
											name: "images/[name].[ext]"
										}
									}
								],
								exclude: [/node_modules/, /public/]
						},
						{
								test: /\.jpg$/,
								use: [
									{
										loader: "url-loader",
										options: {
											limit: 100,
											mimetype: "image/jpg",
											name: "images/[name].[ext]"
										}
									}
								],
								exclude: [/node_modules/, /public/]
						},
						{
								test: /\.png$/,
								use: [
									{
										loader: "url-loader",
										options: {
											limit: 100,
											mimetype: "image/png",
											name: "images/[name].[ext]"
										}
									}
								],
								exclude: [/node_modules/, /public/]
						},
						{
								test: /\.svg/,
								use: [
									{
										loader: "url-loader",
										options: {
											limit: 100,
											mimetype: "image/svg+xml",
											name: "images/[name].[ext]"
										}
									}
								],
								exclude: [/node_modules/, /public/]
						},
						{
								test: /\.mp4$/,
								use: [
									{
										loader: "file-loader",
										options: {
											name: "videos/[name].[ext]"
										}
									}	
								]
						},
						{
								test: /\.woff$/,
								use: [
									{
										loader: "file-loader",
										options: {
											name: "fonts/[name].[ext]"
										}
									}	
								]
						},
						{
								test: /\.woff2$/,
								use: [
									{
										loader: "file-loader",
										options: {
											name: "fonts/[name].[ext]"
										}
									}	
								]
						},
						{
								test: /\.[ot]tf$/,
								use: [
									{
										loader: "file-loader",
										options: {
											name: "fonts/[name].[ext]"
										}
									}
								]
						},
						{
								test: /\.eot$/,
								use: [
									{
										loader: "file-loader",
										options: {
											name: "fonts/[name].[ext]"
										}
									}
								]
						},
						{
								test: /\.txt$/,
								use: 'raw-loader'
						}
				]
		},
		devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : false,
		devServer: {
			headers: { 'Access-Control-Allow-Origin': '*' }
		}
}

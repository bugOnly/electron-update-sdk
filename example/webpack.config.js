const path = require('path');
const nodeExternals = require("webpack-node-externals");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    target: 'web',
    entry: path.resolve(__dirname, './src/index.ts'),
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "../dist")
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    devtool: "source-map",
    // externals: [
    //     nodeExternals()
    // ],
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [{
                loader: 'ts-loader',
                options: {
                    transpileOnly: true // 只做语言转换，而不做类型检查
                }
            }]
        }]
    },
    devServer: {
        port: 9000,
        // https: true
    },
    plugins: [new HtmlWebpackPlugin({
        template: 'public/index.html'
    })],
};
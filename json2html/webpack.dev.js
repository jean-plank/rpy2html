const path = require('path');
const merge = require('webpack-merge');

const DefinePlugin = require('webpack').DefinePlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const common = require('./webpack.common.js');


module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        port: 3000,
        contentBase: common.output.path,
        inline: true, // iframe or inline script
        host: '0.0.0.0',
        overlay: {
            errors: true,
            warnings: true
        },
        hot: true,
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },
    plugins: [
        new DefinePlugin({
            __DEV: JSON.stringify(true),
            __INPUT_JSON: JSON.stringify(
                path.resolve(__dirname, '../generated-json/game.json')
            ),
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'game-engine/templates/index.dev.html'),
            favicon: path.resolve(__dirname, 'game-engine/templates/default.ico'),
            // relative paths to ./dist/
            react: 'lib/react.development.js',
            reactDom: 'lib/react-dom.development.js',
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'node_modules/react/umd/react.development.js'),
                to: 'lib/'
            },
            {
                from: path.resolve(__dirname, 'node_modules/react-dom/umd/react-dom.development.js'),
                to: 'lib/'
            }
        ])
],
});

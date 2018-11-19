const path = require('path');
const merge = require('webpack-merge');

const DefinePlugin = require('webpack').DefinePlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');

const common = require('./webpack.common.js');


module.exports = merge(common, {
    mode: 'production',

    performance : {
        hints : false,
    },

    plugins: [
        new DefinePlugin({
            __DEV: JSON.stringify(false),
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'game-engine/templates/index.prod.html'),
            favicon: path.resolve(__dirname, 'game-engine/templates/default.ico'),
        }),
    ],
});

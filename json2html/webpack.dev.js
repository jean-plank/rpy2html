const path = require('path');
const merge = require('webpack-merge');

const DefinePlugin = require('webpack').DefinePlugin;

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
        hot: true
    },
    plugins: [
        new DefinePlugin({
            __DEV: JSON.stringify(true),
            __INPUT_JSON: JSON.stringify(
                path.resolve(__dirname, '../generated-json/game.json')
            )
        })
    ]
});

const merge = require('webpack-merge');

const DefinePlugin = require('webpack').DefinePlugin;

const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    performance: {
        hints: false
    },
    plugins: [
        new DefinePlugin({
            __DEV: JSON.stringify(false)
        })
    ]
});

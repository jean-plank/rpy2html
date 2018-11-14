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
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },

    plugins: [
        new DefinePlugin({
            __DEV: JSON.stringify(true),
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

const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin =
    require('html-webpack-inline-source-plugin');


module.exports = {
    mode: 'development',
    entry: './dist/converted.js',
    output: {
        path: path.resolve(__dirname, 'dist/game'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            },
            {
                test: /\.(ttf|otf|png|jpg|opus|ogg|mp3|wav)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            // outputPath: 'images/',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new UglifyJsPlugin(),
        new HtmlWebpackPlugin({
            title: 'Test page',
            template: 'src/game-engine/index.html',
            inlineSource: '.(js|css)$',
        }),
        new HtmlWebpackInlineSourcePlugin(),
    ],
}

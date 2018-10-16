const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin =
    require('html-webpack-inline-source-plugin');

// markdown convert to html
// const marked = require("marked");
// const renderer = new marked.Renderer();


module.exports = {
    mode: 'development',
    entry: './src/converted/converted.ts',
    // devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            // ts
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: [
                    /node-modules/,
                    "**/*.spec.ts",
                ],
            },
            // css
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            },
            // fonts
            {
                test: /\.(ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[hash].[ext]',
                            outputPath: 'fonts/',
                        },
                    },
                ],
            },
            // images
            {
                test: /\.(png|jpg|jpeg|ico)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[hash].[ext]',
                            outputPath: 'images/',
                        },
                    },
                ],
            },
            // sounds
            {
                test: /\.(opus|ogg|mp3|wav)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[hash].[ext]',
                            outputPath: 'sounds/',
                        },
                    },
                ],
            },
            // md
            {
                test: /\.md$/,
                use: [
                    {
                        loader: "html-loader"
                    },
                    {
                        loader: "markdown-loader",
                        //those options are optional
                        options: {
                            // renderer
                        }
                    }
                ]
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
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

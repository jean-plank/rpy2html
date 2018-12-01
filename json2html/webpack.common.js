const path = require('path');


module.exports = {
    entry: path.resolve(__dirname, './game-engine/index.tsx'),
    output: {
        path: path.resolve(__dirname, '../dist/'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            // ts
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
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
            // videos
            {
                test: /\.(mp4)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[hash].[ext]',
                            outputPath: 'videos/',
                        },
                    },
                ],
            },
            // md
            {
                test: /\.md$/,
                use: [
                    'html-loader',
                    'markdown-loader',
                ]
            },
        ],
    },
}

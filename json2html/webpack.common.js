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
            {
                test: /\.tsx?$/,
                use: [
                    'awesome-typescript-loader',
                ],
            },
            // css
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'typings-for-css-modules-loader',
                        options: {
                            modules: true,
                            namedExport: true,
                            camelCase: true,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('autoprefixer'),
                            ],
                        },
                    },
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
                test: /\.(webm)$/,
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

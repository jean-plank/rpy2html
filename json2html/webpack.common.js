const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: path.resolve(__dirname, './weeb-engine/index.tsx'),
    output: {
        path: path.resolve(__dirname, '../dist/'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            // ts
            {
                test: /\.tsx?$/,
                use: ['awesome-typescript-loader']
            },
            // fonts
            {
                test: /\.(ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[hash].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            },
            // images
            {
                test: /\.(png|jpg|jpeg|ico)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[hash].[ext]',
                            outputPath: 'images/'
                        }
                    }
                ]
            },
            // sounds
            {
                test: /\.(opus|ogg|mp3|wav)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[hash].[ext]',
                            outputPath: 'sounds/'
                        }
                    }
                ]
            },
            // videos
            {
                test: /\.(webm|ogv)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[hash].[ext]',
                            outputPath: 'videos/'
                        }
                    }
                ]
            },
            // md
            {
                test: /\.md$/,
                use: ['html-loader', 'markdown-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'templates/index.html'),
            favicon: path.resolve(__dirname, 'templates/default.ico')
        })
    ]
}

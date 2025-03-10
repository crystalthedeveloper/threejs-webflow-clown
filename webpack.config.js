const path = require('path');

module.exports = {
    mode: 'production', // Set mode to production or development
    entry: './src/index.js',
    output: {
        filename: '[name].bundle.js', // Use [name] for dynamic chunk naming
        path: path.resolve(__dirname, 'dist'),
        clean: true, // This will clean the output directory before each build
    },
    optimization: {
        splitChunks: {
            chunks: 'all',  // Split all chunks
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        // Add your plugins here
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        compress: true,
        port: 9000,
    },
};
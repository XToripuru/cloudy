const path = require('path');

module.exports = {
    
    entry: {
        app: ['./lib/renderers/dom.js'],
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].js'
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, use: {loader: 'babel-loader', options: {presets: ['@babel/preset-env', '@babel/preset-react']}} }
        ],
    },
};

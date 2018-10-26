var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
	entry: {
        main: './main'
    },
    output: {
        path: path.join(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'main.js'
    },
    module: {
    	rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        // 利用下方创建好的插件，将.vue文件中的CSS文本抽离到生成的CSS文件中
                        css: ExtractTextPlugin.extract({
                            use: 'css-loader', 
                            fallback: 'vue-style-loader' 
                        })
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                // 利用下方创建好的插件，将.vue文件中的CSS文本抽离到生成的CSS文件中
                use: ExtractTextPlugin.extract({
                    use: 'css-loader', // 解析CSS文件，遇到“@import”等语句就将相应样式文件引入
                    fallback: 'style-loader' // 将会使用style-loader生成一个内容为最终解析完的css代码的style标签，放到head标签里
                })
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=1024'
            }
        ]
    },
    plugins: [ 
        // 定义抽离CSS文本的插件
    	new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        })
    ]
}

module.exports = config;
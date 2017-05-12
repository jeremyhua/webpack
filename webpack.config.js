const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');              // 生成html
const ExtractTextPlugin  = require("extract-text-webpack-plugin");    // 提取css

// true为生产环境，反之为开发环境
const IsProduction = process.env.NODE_ENV === 'production' ? true : false;

// 获取dll打包的json文件
const Manifest = require((IsProduction ? "./build" : "./dev") + '/public/vendor/manifest.json');

// 本地服务器变量
const ServerPost = "8080";
const ServerHost= "127.0.0.1";
const ServerContentBase= "./dev";

// 定义/封装路径
const pathDefine = src => path.resolve(__dirname, src ? src : "");
const Path = {};

// 入口路径
Path.entryDir= pathDefine("src");
Path.entry = {};
Path.entry.index = pathDefine("src/public/js/index");

// 本地服务器入口文件配置，开发环境有效
!IsProduction ? Path.entry.server = "webpack-dev-server/client?http://"+ ServerHost + ":" + ServerPost +"/" : "";
!IsProduction ? Path.entry.hot = "webpack/hot/only-dev-server" : "";

// 输出路径
Path.outputPath = pathDefine((IsProduction ? "build" : "dev") + "/public");
Path.outputPublicPath = IsProduction ? "../public/" : "public/";

Path.outputFilename = "js/[name]"+ (IsProduction ? ".min" : "") +".js";

Path.outputImg = "img/[name]_[hash].[ext]";
Path.outputFonts = "fonts/[name]_[hash].[ext]";

// 提取css
Path.ExtractPluginPublicPath = "../";
Path.ExtractPluginCss = "css/[name]"+ (IsProduction ? ".min" : "") +".css";

// 生成html路径定义
Path.HtmlPluginTemplate = pathDefine("src/views/index.pug");
Path.HtmlPluginFilename = pathDefine((IsProduction ? "build/views" : "dev") + "/index.html");
Path.HtmlPluginVendorJs = IsProduction ? "../public/vendor/" + Manifest.name + ".min.js" : "public/vendor/" + Manifest.name + ".js";

// dll插件配置项路径定义
Path.DllPluginVendorDir = pathDefine((IsProduction ? "build" : "dev") + "/public/vendor");
Path.DllPluginManifest = (IsProduction ? "./build" : "./dev") + "/public/vendor/manifest.json";

module.exports = {

    //入口文件配置
    entry: Path.entry,

    // 输出文件配置
    output: {
        path: Path.outputPath,
        filename: Path.outputFilename,
        publicPath: Path.outputPublicPath,
    },

    // 加载器模块
    module: {
        rules: [
            {
                test: /.(css|sass|scss)$/,
                include: Path.entryDir,
                use: ExtractTextPlugin.extract({
                    publicPath: Path.ExtractPluginPublicPath,
                    fallback: "style-loader",
                    use: ["css-loader", "autoprefixer-loader", "sass-loader"],
                }),
            }, {

                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader:"babel-loader",
                    options: {
                        presets: ["es2015"],
                    },
                }],
            }, {

                test: /\.(png|jpe?g|gif|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,                        // 小于8192字节打包成base64格式图片
                        name: Path.outputImg,
                    },
                }],
            }, {

                test: /\.(woff|woff2|svg|eot|ttf)?$/,
                include: Path.entryDir,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: Path.outputFonts,
                    },
                }],
            }, {

                test: /\.pug$/,
                include: Path.entryDir,
                use: [{
                    loader: 'pug-loader',
                    options: {
                        pretty: !IsProduction,                 // 默认false，反之不压缩
                    }
                }],
            },
        ]
    },

    // 插件配置项
    plugins: [
        // 生成html文件
        new HtmlWebpackPlugin ({
            // favicon:'./xx.ico',                             // favicon路径
            title: 'dome',                                    // html 标题
            filename: Path.HtmlPluginFilename,              // 生成的html存放路径，相对于 path
            template: Path.HtmlPluginTemplate,              // html模板路径
            hash: true,                                       // 为静态资源生成hash值
            showErrors: !IsProduction,                        // 把错误信息打印在页面，默认为ture,false为不显示
            vendorJs: Path.HtmlPluginVendorJs,              // 自定义配置，用于引用打包的公共代码
        }),

        // 提取css文件
        new ExtractTextPlugin(Path.ExtractPluginCss),

        // 与webpack.dll.js打包出来的文件做关联
        new webpack.DllReferencePlugin({
            context: Path.DllPluginVendorDir,
            manifest: require(Path.DllPluginManifest),
        }),

        //定义全局变量
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        }),
    ],


    resolve:{
        //配置别名
        alias: {
            // ...
        },
    },
};

// 生产环境
if (IsProduction) {

    // 插件
    module.exports.plugins = (module.exports.plugins || []).concat([
        // ...
    ]);

// 开发环境
}else {
    // sourceMap 代码调试
    module.exports.devtool= '#cheap-module-source-map';

    // 本地服务器
    module.exports.devServer = {
        host: ServerHost,
        port: ServerPost,
        open: true,
        inline: true,
        contentBase: ServerContentBase,
    };


    // 插件
    module.exports.plugins = (module.exports.plugins || []).concat([

        // 热更新
        new webpack.HotModuleReplacementPlugin(),

        // 错误重启
        new webpack.NoErrorsPlugin(),
    ]);
}

const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require('clean-webpack-plugin');       // 清除文件

// true为生产环境，反之为开发环境
const IsProduction = process.env.NODE_ENV === 'production' ? true : false;
// 封装路径函数、定义路径对象
const pathDefine = src => path.resolve(__dirname, src ? src : "");
const Path = {};

// 打包文件目录
Path.dllDir = (IsProduction ? "build" : "dev") + "/public/vendor";

// 入口路径，这里放第三方插件，例如jquery、vue、react等
Path.entry = ["jquery"];

// 输出路径定义
Path.outputPath =  pathDefine(Path.dllDir);
Path.outputFilename =  '[name]_[hash]'+ (IsProduction ? ".min" : "") +'.js';
Path.outputLibrary =  '[name]_[hash]';

// 清除目录
Path.clearDir = IsProduction ? "./build" : "./dev";

// dll插件配置项路径
Path.DllPluginContext = pathDefine(Path.dllDir);
Path.DllPluginPath = pathDefine(Path.dllDir + "/manifest.json");
Path.DllPluginName = Path.outputLibrary;

module.exports = {
    //入口文件配置
    entry:  Path.entry,

    // 输出文件配置
    output: {
        path: Path.outputPath,
        filename: Path.outputFilename,
        library: Path.outputLibrary,
    },

    // 插件配置项
    plugins: [
        // 清除文件
        new CleanWebpackPlugin(Path.clearDir),

        // dll文件打包
        new webpack.DllPlugin({
            context: Path.DllPluginContext,
            path: Path.DllPluginPath,
            name: Path.DllPluginName,
        }),

    ],
};

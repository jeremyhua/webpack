# webpack脚手架
## 介绍
功能：Pug + Sass + img + fonts + Es6 + 开发/生产环境 + 优化(css3自动添加前缀、dll打包等)

教程：后续贴出

## 项目结构
```
+webpack
    |-dev                  #建构生产文件夹(打包的时候自动创建)
    |    |-public
    |    |    |-js
    |    |    |-img
    |    |    |-css
    |    |    |-fonts
    |    |    |-vendor     #存放第三方依赖，例如jquery、vue等
    |    |
    |    |-index.html
    |
    |-build                #构建生产文件夹(打包的时候自动创建)
    |    |-public
    |    |    |-js
    |    |    |-img
    |    |    |-css
    |    |    |-fonts
    |    |    |-vendor
    |    |
    |    |-views
    |
    |-src                   #源文件夹
    |    |-public
    |    |    |-js
    |    |       |----index.js
    |    |    |-img
    |    |       |----0.jpg
    |    |       |----1.jpg
    |    |    |-css
    |    |       |----main.sass
    |    |    |-fonts
    |    |
    |    |-views
    |       |----index.pug
    |
    |-webpack.config.js     #webpack配置文件
    |-webpack.dll.js        #dll配置文件
```

## 安装
在项目根目录下运行
```
npm install
```
或
```
npm install webpack  file-loader url-loader pug pug-loader  sass-loader node-sass style-loader css-loader autoprefixer-loader babel-loader babel-core babel-preset-es2015 html-webpack-plugin extract-text-webpack-plugin webpack-dev-server copy-webpack-plugin clean-webpack-plugin cross-env jquery  --save-dev
```

## 使用
开发环境下，需要打开两个命令窗口，一个运行构建
```
npm run dev
```
另外一个开启服务器
```
npm run server
```

生产环境命令
```
npm run build
```


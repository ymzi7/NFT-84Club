### 1、检测是否有Node.js和npm工具

- 检测是否有node和npm

  -- 在控制面板中输入下方的代码

  ``` 
  node -v
  ```

* 如果控制台没有输出相应的版本号则进入该地址进行下载、安装

  <https://nodejs.org/en/download/>

* npm是随着NodeJs一起安装的包管理工具，同样通过输入“npm -v”来检测是否安装成功，出现版本提示表示安装成功

* 大家都知道国内直接使用 npm 的官方镜像是非常慢的，这里推荐使用淘宝 NPM 镜像。

  淘宝 NPM 镜像是一个完整 npmjs.org 镜像，你可以用此代替官方版本(只读)，同步频率目前为 10分钟 一次以保证尽量与官方服务同步。

  你可以使用淘宝定制的 cnpm (gzip 压缩支持) 命令行工具代替默认的 npm:

  ``` 
   npm install -g cnpm --registry=https://registry.npm.taobao.org
  ```

  这样可以使用cnpm命令来安装模块

  ```
  cnpm install [name]
  ```

  

### 2、安装项目用到的第三方包

```  
npm install
```

若在安装后还提示丢失了某个第三方包，则使用“npm install <Module Name>”继续安装

###3、配置文件修改接口地址

* src/network/request.js

```
// 测试环境
const baseURL = '/api'
// 正式环境
const baseURL = 'http://84club.chuangjisu.com/nft'
```
其中，测试环境开发，有跨域问题存在时还需配置下方示例代理(修改target)：
* vue.config.js

```
 devServer: {
    proxy: {
      '/api': {
        target: 'http://84club.chuangjisu.com/nft ',
        changeOrigin: true,
        ws: true,
        pathRewrite: {//重写路径
          "^/api": ''//代理路径
        }
      }
    },
  }
```

### 4、dist 输出路径

* 在config/index.js文件中进行修改

``` 
  build: {
    // Template for index.html
    index: path.resolve(__dirname,'../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
```

### 5、启动项目

* 以package.json中的scripts：{start}为准

``` 
npm run serve
```

### 6、项目打包

* 以package.json中的scripts：{build}为准

``` 
npm run build
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# requestHeader

> 请求头中的常见属性说明以及这些属性的作用

### 实现功能

- [x] `Accept-Language` 实现**多语言** 
- [x] `Referer` 实现**防盗链**
- [x] `Range` 实现文件**断点续传**（206）
- [x] `Cache-Control & Last-Modified & ETag` 实现**缓存**
- [x] `Accept-Encoding` 实现**文件压缩**
- [x] `Cookie` 实现 **cookie & session & jwt**

### 启动这个项目

```bash
git clone https://github.com/guozhiyuan16/share.git

## 安装依赖
cd share
yarn install

## 推荐使用nodemon启动服务
yarn global add nodemon
nodemon app.js

## 默认打开localhost:3000/index.html 即可看到演示项目
```

### 目录结构说明

```js
.
│
└─share                 // 后端文件夹
    ├─config            // 项目配置 port、token-secret 等等
    ├─controllers       // 业务控制层
    ├─download          // 下载文件地址
    ├─middlewares       // 中间件
    ├─page              // 静态文件
    ├─router            // 路由
    ├─utils             // 工具包
    └─  app.js          // 后端主入口文件
```

### 多语言实现

> 多语言就是一个网站可以实现多种语言的切换，这里不讨论建N个网站，一个语言对应一个网站。这里讨论如何智能返回用户所需的语言。

| client | server  |
| --- | --- |
| 向server扔过去了`Accept-Language` |  |
|  | 接收对方的`Accept-Language` |
|  | 字段大概这样子`zh,en-US;q=0.9,en;q=0.8 `|
|  | 开始处理，将字段变成带权重`q`的数组 |
|  |   排序好大概长这样[{"name":"zh","q":1},{"name":"en-US","q":0.9},{"name":"en","q":0.8}]|
# requestHeader

> 请求头中的常见属性说明以及这些属性的作用

## 实现功能

- [x] `Accept-Language` 实现**多语言** 
- [x] `Referer` 实现**防盗链**
- [x] `Range` 实现文件**断点续传**（206）
- [x] `Cache-Control & Last-Modified & ETag` 实现**缓存**
- [x] `Accept-Encoding` 实现**文件压缩**
- [x] `Cookie` 实现 **cookie & session & jwt**

## 启动这个项目

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

## 目录结构说明

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

## `多语言`

> 多语言就是一个网站可以实现多种语言的切换，这里不讨论建N个网站，一个语言对应一个网站。这里讨论如何智能返回用户所需的语言。

| client | server  |
| --- | --- |
| 向server扔过去了`Accept-Language` |  |
|  | 接收对方的`Accept-Language` |
|  | 字段大概这样子`zh,en-US;q=0.9,en;q=0.8 `（q没有传值`默认为1`）|
|  | 开始处理，将字段变成带权重`q`的数组 |
|  | 排序好大概长这样[{"name":"zh","q":1},{"name":"en-US","q":0.9},{"name":"en","q":0.8}]|
|  | `根据权重`返回拥有的语言  |
|  | 没有匹配到返回`默认`的语言 |
| 渲染不同的语言页面 | http请求完成 |

## `防盗链`

> 这个技术用的最多的应该就是对于图片的限制，只有在白名单中的域名可以获取到，其他域名返回一个提示图片。（减轻自己服务器压力）
> ps : 微博图片有防盗链

### 如何本地模拟防盗链效果？
```bash
## 打开微博，随意找到一张图片 
https://wx2.sinaimg.cn/large/0024cZx9ly8grtevkbgodj60f408in3t02.jpg

## 新建index.html，引入图片
<img src="https://wx2.sinaimg.cn/large/0024cZx9ly8grtevkbgodj60f408in3t02.jpg" />

## 用户http-server 或者 vscode内置的插件启动服务
打开启动静态服务的页面，发现图片无法展示
```

| client | server |
| --- | --- |
| html中请求一张图片 |  |
|     |  接收对方的`Referer`(`浏览器的地址栏地址`)  |
|     |  获取 `host`(图片请求的地址) |
|     |  如果`域名相同`或者在`白名单`内 |
|     |  返回图片 |
|     |  返回一张万能图|
| 渲染不同的图片 | http请求完成 |


## `206`

> 支持获取页面的某一部分
> ps:百度的网站支持206

| client | server |
| --- | --- |
| 发起请求 |  |
|     |  接收对方的`Range`(`bytes=${start}-${end}`)  |
|     |  正则`匹配到开始和结束`位置 |
|     |  读取静态文件`获取文件大小` |
|     |  设置状态码`206`|
|     |  设置响应 `Content-Range`:`bytes ${start}-${end}/${statObj.size}` |
|     |  设置响应 `Content-Length`:`end-start+1`|
|     | http请求完成 |



## `缓存`

> 优势
- 减少了冗余的数据传输，节省了网费。
- 减少了服务器的负担， 大大提高了网站的性能
- 加快了客户端加载网页的速度

### 缓存分类

- 强制缓存如果生效，不需要再和服务器发生交互，而对比缓存不管是否生效，都需要与服务端发生交互

- 两类缓存规则可以同时存在，强制缓存优先级高于对比缓存，也就是说，当执行强制缓存的规则时，如果缓存生效，直接使用缓存，不再执行对比缓存规则

#### 强制缓存

- 强制缓存，在缓存数据未失效的情况下，可以直接使用缓存数据，那么浏览器是如何判断缓存数据是否失效呢？ 我们知道，在没有缓存数据的时候，浏览器向服务器请求数据时，服务器会将数据和缓存规则一并返回，缓存规则信息包含在响应header中。

| client | server |
| --- | --- |
| 发起请求 |  |
|     |  收到请求 |
|     |  响应设置`Cache-Control:max-age=10` |
|     |  十秒内不要烦我 |
|  发起请求   | |
|     |  是否在设置时间内 |
|     |  设置响应 `Content-Length`:`end-start+1`|
|     | http请求完成 |

![强制缓存](http://101.34.12.12/img/cache1.png?v=10010)

#### 对比缓存

- 对比缓存，顾名思义，需要进行比较判断是否可以使用缓存。
- 浏览器第一次请求数据时，服务器会将缓存标识与数据一起返回给客户端，客户端将二者备份至缓存数据库中。
- 再次请求数据时，客户端将备份的缓存标识发送给服务器，服务器根据缓存标识进行判断，判断成功后，返回304状态码，通知客户端比较成功，可以使用缓存数据。

![对比缓存](http://101.34.12.12/img/cache2.png?v=10086)

### 请求流程

- 第一次请求

![第一次请求](http://101.34.12.12/img/first.png)


- 第二次请求

![第二次请求](http://101.34.12.12/img/second.png)


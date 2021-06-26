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

- `强制缓存如果生效，不需要再和服务器发生交互`，而对比缓存`不管是否生效，都需要与服务端发生交互`

- 两类缓存规则可以同时存在，强制缓存优先级高于对比缓存，也就是说，当执行强制缓存的规则时，如果缓存生效，直接使用缓存，不再执行对比缓存规则

#### A.强制缓存 

- 强制缓存，在缓存数据未失效的情况下，可以直接使用缓存数据，那么浏览器是如何判断缓存数据是否失效呢？ 我们知道，在没有缓存数据的时候，浏览器向服务器请求数据时，服务器会将数据和缓存规则一并返回，缓存规则信息包含在响应header中。
- Cache-Control 配置
    - private 客户端可以缓存
    - public 客户端和代理服务器都可以缓存
    - max-age=60 缓存内容将在60秒后失效
    - no-cache 需要使用对比缓存验证数据,强制向源服务器再次验证
    - no-store 所有内容都不会缓存，强制缓存和对比缓存都不会触发


![强制缓存](http://101.34.12.12/img/cache1.png?v=10010)

| client | server |
| --- | --- |
| 发起请求 |  |
|     |  收到请求 |
|     |  响应设置`Cache-Control:max-age=10` |
|     |  10秒内不要找我 |
|  发起请求，超出`过期时间`重新请求，否则直接拿缓存  | |




#### B.对比缓存

> ps: 服务端返回304状态码浏览器就会去缓存中取对应缓存文件
> ps: 两种是可以同时存在的

- 对比缓存，顾名思义，需要进行比较判断是否可以使用缓存。
- 浏览器第一次请求数据时，服务器会将缓存标识与数据一起返回给客户端，客户端将二者`备份至缓存数据库中`。
- 再次请求数据时，客户端将备份的`缓存标识`发送给服务器，服务器根据缓存标识进行判断，判断成功后，`返回304状态码`，通知客户端比较成功，可以`使用缓存数据`。

![对比缓存](http://101.34.12.12/img/cache2.png?v=10086)

##### Last-Modify & If-Modified-Since

- Last-Modified：响应时告诉客户端此资源的`最后修改时间`
- `If-Modified-Since`：当资源过期时（使用Cache-Control标识的max-age），发现资源具有Last-Modified声明，则再次向服务器请求时带上头If-Modified-Since。
- 服务器收到请求后发现有头If-Modified-Since则与被请求资源的最后修改时间进行比对。若最后修改时间较新，说明资源又被改动过，则`响应最新的资源`内容并返回200状态码；
- 若最后修改时间和If-Modified-Since一样，说明资源没有修改，则响应304表示`未更新`，告知浏览器继续使用所保存的缓存文件。

| client | server |
| --- | --- |
| 发起请求 |  |
|         |  响应中设置 `Last-Modify` |
| 浏览器接收`Last-Modify` | |
| 下次请求 | |
| 请求头中添加`If-Modified-Since`  | |
|    | 后端接收`If-Modified-Since` |
|    | `文件修改时间` 与 `If-Modified-Since`比较|
|    | 相等返回`304`不相等返回最新文件 |

###### 最后修改时间存在问题

- 某些服务器不能精确得到文件的最后修改时间， 这样就无法通过最后修改时间来判断文件是否更新了。
- 某些文件的修改非常频繁，在秒以下的时间内进行修改. Last-Modified只能精确到秒。
- 一些文件的最后修改时间改变了，但是内容并未改变。 我们不希望客户端认为这个文件修改了。
- 如果同样的一个文件位于多个CDN服务器上的时候内容虽然一样，修改时间不一样。

##### ETag & If-None-Match

> ETag是实体标签的缩写，根据实体内容生成的一段hash字符串,可以标识资源的状态。当资源发生改变时，ETag也随之发生变化。 ETag是Web服务端产生的，然后发给浏览器客户端。

- 客户端想判断缓存是否可用可以先获取缓存中文档的ETag，然后通过If-None-Match发送请求给Web服务器询问此缓存是否可用。
- 服务器收到请求，将服务器的中此文件的ETag,跟请求头中的If-None-Match相比较,如果值是一样的,说明缓存还是最新的,Web服务器将发送304 Not Modified响应码给客户端表示缓存未修改过，可以使用。
- 如果不一样则Web服务器将发送该文档的最新版本给浏览器客户端

| client | server |
| --- | --- |
| 发起请求 |  |
|         |  响应中设置 `E-Tag` |
| 浏览器接收`E-Tag` | |
| 下次请求 | |
| 请求头中添加`If-None-Match`  | |
|    | 后端接收`If-Modified-Since` |
|    | `文件签名` 与 `E-Tag`比较|
|    | 相等返回`304`不相等返回最新文件 |

> [你知道 http 响应头中的 ETag 是如何生成的吗](https://juejin.cn/post/6844904018012012552)

### crypto加密模块

- 摘要算法 （md5）
    - `不能反解`（网上的md5解码其实就是`撞库`）
    - `摘要` 不能根据摘要的结果 反推摘要的过程 如果内容有一点变化，摘要的结果完全不同
    - `相同值摘要的结果相同`
- 加盐算法 （sha1/sha256）
    - 如果内容是一致的，但是`加的盐不同结果也不同`


### 请求流程

- 第一次请求

![第一次请求](http://101.34.12.12/img/first.png)


- 第二次请求

![第二次请求](http://101.34.12.12/img/second.png)


## 压缩



## cookie

- HTTP1.0中协议是`无状态`的，但在WEB应用中，在多个请求之间共享会话是非常必要的，所以出现了Cookie
- cookie是为了`辩别用户身份`，进行会话跟踪而`存储在客户端`上的数据

### 使用步骤

- 服务器发送cookie 

客户端第一次访问服务器的时候服务器通过响应头向客户端发送Cookie,属性之间用分号空格分隔

```
Set-Cookie:name=xxx; Path=/
```

- 客户端接收保存cookie

客户端接收到Cookie之后保存在本地

- 客户端发送cookie

以后客户端再请求服务器的时候会把此Cookie发送到服务器端

```
Cookie:name=zfpx
```

### cookie重要属性

| 属性 | 说明 |
| --- | --- |
| `name=value` | 键值对，可以`设置要保存的 Key/Value` |
| `Domain` | 域名，`默认是当前域名` |
| `maxAge` | 最大失效时间(毫秒),设置在多少后失效 |
| Expires| 过期时间(秒)，在设置的某个时间点后该 Cookie 就会失效，如 expires=Money, 05-Dec-11 11:11:11 GMT |
| secure | 当 secure 值为 true 时，cookie 在 HTTP 中是无效，在 HTTPS 中才有效 |
| `Path`	 | 表示 cookie 影响到的路径，如 path=/。如果`路径不能匹配时，浏览器则不发送这个Cookie` |
| `httpOnly` | 如果在COOKIE中设置了httpOnly属性，则通过程序`(JS脚本)将无法读取到COOKIE`信息，防止XSS攻击产生 |

### cookie 注意事项

- 可能被客户端篡改，`使用前验证合法性`
- `不要存储敏感数据`，比如用户密码，账户余额
- `使用httpOnly`保证安全
- 尽量`减少cookie的体积`
- `设置正确的domain和path`，减少数据传输


## session

- session是另一种记录客户状态的机制，不同的是Cookie保存在客户端浏览器中，而session保存在服务器上
- 客户端浏览器访问服务器的时候，服务器把客户端信息以某种形式记录在服务器上，这就是session。客户端浏览器再次访问时只需要从该Session中查找该客户的状态就可以了


### cookie和session区别

1. cookie数据存放在客户的浏览器上，session数据放在服务器上。
2. cookie不是很安全，别人可以分析存放在本地的COOKIE并进行COOKIE欺骗 考虑到安全应当使用session
3. session会在一定时间内保存在服务器上。当访问增多，会比较占用你服务器的性能 考虑到减轻服务器性能方面,应当使用COOKIE
4. 单个cookie保存的数据不能超过4K，很多浏览器都限制一个站点最多保存20个cookie

> 将登陆信息等重要信息存放为session、其他信息如果需要保留，可以放在cookie中


## JWT (json-web-token)








## User-Agent

User Agent中文名为用户代理，简称 UA，它是一个特殊字符串头，使得服务器能够识别客户使用的操作系统及版本、CPU 类型、浏览器及版本、浏览器渲染引擎、浏览器语言、浏览器插件等。

- 请求头 User-Agent:Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36

> [浏览器野史 UserAgent列传（上）](http://litten.me/2014/09/26/history-of-browser-useragent/#more)

> [浏览器野史 UserAgent列传（下）](http://litten.me/2014/10/05/history-of-browser-useragent2/)
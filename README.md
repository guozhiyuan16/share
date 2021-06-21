## requestHeader

### 缓存控制

#### 强制缓存
- Cache-Control:max-age=10  
- Expires:new Date(Date.now() + 10 * 1000).toUTCString()  兼容IE,http1.0

#### 协商缓存
const config = {
    PORT: 3000, // 启动端口
    TOKEN :{
        secret:"guo-test", // 加密解密秘钥  => 可以通过openssl生成一个1024字节的秘钥
        expiresIn: '720h', // token有效期
    }
}

module.exports = config;
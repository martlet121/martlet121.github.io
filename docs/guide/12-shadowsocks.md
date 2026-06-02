   协议漏洞原因使Shadowsocks放弃OTA(一次认证)而使用AEAD，V2Ray的Shadowsocks已使用AEAD且兼容OTA，当method为aes-256-gcm、aes-128-gcm、chacha20-poly1305时就是使用的AEAD，使用AEAD时OTA失效

​    Shadowsocks已经弃用simple-obfs，可使用基于V2Ray的新版混淆插件，也可使用V2Ray的Websocket/http2+TLS







一、客户端配置

​    打开客户端解压后路径config.json文件，编辑完成后运行v2ray.exe文件

```json
{
  "inbounds": [
    {
      "port": 1080,               //本地监听端口，浏览器配置代理使用的端口
      "protocol": "socks",            //入口协议为SOCKS 5
      "sniffing": {
        "enabled": true,
        "destOverride": ["http", "tls"]
      },
      "settings": {
        "auth": "noauth"                 //socks的认证设置，noauth代表不认证，由于socks通常在客户端使用，所以这里不认证
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "shadowsocks",
      "settings": {
        "servers": [
          {
            "address": "45.76.177.113",                 //Shadowsocks服务器地址
            "method": "aes-128-gcm",                 //Shadowsocks服务器加密方式
            "ota": true,                //是否开启OTA，true为开启
            "password": "martlet121",                  //Shadowsocks服务器密码
            "port": 20000                      //Shadowsocks服务器监听端口号
          }
        ]
      }
    }
  ]
}
```





二、服务端配置

[root@martlet121 ~]# <mark> vim /usr/local/etc/v2ray/config.json </mark>                 #修改配置文件

```json
{
  "inbounds": [
    {
      "port": 20000,                 //服务端监听端口
      "protocol": "shadowsocks",
      "settings": {
        "method": "aes-128-gcm",
        "ota": true,                //是否开启OTA
        "password": "martlet121"                    //连接服务端时认证密码
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "settings": {}
    }
  ]
}
```

[root@martlet121 ~]# <mark> systemctl restart v2ray </mark>                    #重启服务

[root@martlet121 ~]# <mark> netstat -an | grep 20000 </mark>                  #查看端口监听

tcp6       0      0 :::20000                :::*                    LISTEN

[root@martlet121 ~]#
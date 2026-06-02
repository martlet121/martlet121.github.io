   多路复用（multiplexing），将多条TCP连接合并成一条，节省资源，提高并发能力

​    Mux只需在客户端开启，服务器会自动识别







一、服务器侧配置

[root@martlet121 ~]# <mark> vim /usr/local/etc/v2ray/config.json </mark>                     #修改服务器侧配置文件

```json
{
  "inbounds": [
    {
      "port": 16823,           //服务器监听端口
      "protocol": "vmess",              //主传入协议
      "settings": {
        "clients": [
          {
            "id": "6603eb89-d26e-46b2-a626-49e18e074a6e",              //用户ID，客户端与服务器必须相同；服务端使用此ID解密客户端传来的包
            "alterId": 0                //v4.28.1版本之后必须设置为0以启用VMessAEAD
          }
        ]
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",                  //主传出协议，直连的意思
      "settings": {}
    }
  ]
}
```

[root@martlet121 ~]# <mark> systemctl restart v2ray </mark>                   #重启服务应用配置





二、客户端配置

​    打开客户端解压后路径config.json文件，编辑完成后运行v2ray.exe文件

```json
{
  "inbounds": [
    {
      "port": 1080,               //本地监听端口，浏览器配置的代理端口
      "protocol": "socks",               //入口协议为SOCKS 5
      "sniffing": {                   //流量探测，根据指定的流量类型，重置所请求的目标；识别域名后应用域名路由规则、解决dns污染、可识别BT协议再处理
        "enabled": true,
        "destOverride": ["http", "tls"]
      },
      "settings": {
        "auth": "noauth"                   //socks的认证设置，noauth代表不认证，由于socks通常在客户端使用，所以这里不认证
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "vmess",                  //出口协议
      "settings": {
        "vnext": [
          {
            "address": "45.76.177.113",                   //服务器地址，请修改为你自己的服务器 IP 或域名
            "port": 16823,                  //服务器端口
            "users": [
              {
                "id": "6603eb89-d26e-46b2-a626-49e18e074a6e",                      //用户ID，必须与服务器端配置相同；客户端使用此ID加密后再传给服务端
                "alterId": 0                  //此处的值也应当与服务器相同，v4.28.1版本之后必须设置为0以启用VMessAEAD
              }
            ]
          }
        ]
      },
      "mux": {"enabled": true}              //实际只是多加了这行参数
    }
  ]
}
```


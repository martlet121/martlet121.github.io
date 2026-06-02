   VMess协议基于时间认证，服务器和客户端的系统时间相差必须在90秒以内







一、客户端配置

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
            "port": 20000,                  //服务器端口
            "users": [
              {
                "id": "6603eb89-d26e-46b2-a626-49e18e074a6e",                      //用户ID，必须与服务器端配置相同；客户端使用此ID加密后再传给服务端
                "alterId": 0,                  //此处的值也应当与服务器相同，v4.28.1版本之后必须设置为0以启用VMessAEAD
                "method": "aes-128-gcm",                    //vmess配合此加密协议速度最快
                "password": "martlet121"
              }
            ]
          }
        ]
      }
    }
  ]
}
```





二、服务端配置

[root@martlet121 ~]# <mark> uuidgen </mark>               #随机一个uuid，客户端要通过uuid来连接服务器

6603eb89-d26e-46b2-a626-49e18e074a6e

[root@martlet121 ~]# <mark> vim /usr/local/etc/v2ray/config.json </mark>                 #修改配置文件

```json
{
  "inbounds": [
    {
      "port": 20000,           //服务器监听端口
      "protocol": "vmess",              //主传入协议
      "settings": {
        "clients": [
          {
            "id": "6603eb89-d26e-46b2-a626-49e18e074a6e",              //用户ID，客户端与服务器必须相同；服务端使用此ID解密客户端传来的包
            "alterId": 0,                //v4.28.1版本之后必须设置为0以启用VMessAEAD
            "method": "aes-128-gcm",                     //vmess配合此加密协议速度最快
            "password": "martlet121"
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

[root@martlet121 ~]# <mark> systemctl restart v2ray </mark>                #修改配置后要重启生效

[root@martlet121 ~]# <mark> netstat -an | grep 20000 </mark>                #查看端口监听

tcp6       0      0 :::20000                :::*                    LISTEN

[root@martlet121 ~]#


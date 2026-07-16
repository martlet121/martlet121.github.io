---
description: "可在一个vnext下写2个出口服务器地址，这种方式默认轮询；也不用定义负载均衡组"
---

   可在一个vnext下写2个出口服务器地址，这种方式默认轮询；也不用定义负载均衡组







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
            "port": 20001,                  //服务器端口
            "users": [
              {
                "id": "6603eb89-d26e-46b2-a626-49e18e074a6e",                      //用户ID，必须与服务器端配置相同；客户端使用此ID加密后再传给服务端
                "alterId": 0                  //此处的值也应当与服务器相同，v4.28.1版本之后必须设置为0以启用VMessAEAD
              }
            ]
          },
          {
            "address": "45.76.177.113",                   //服务器地址，请修改为你自己的服务器 IP 或域名
            "port": 20002,                  //服务器端口
            "users": [
              {
                "id": "6603eb89-d26e-46b2-a626-49e18e074a6e",                      //用户ID，必须与服务器端配置相同；客户端使用此ID加密后再传给服务端
                "alterId": 0                  //此处的值也应当与服务器相同，v4.28.1版本之后必须设置为0以启用VMessAEAD
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

[root@martlet121 ~]# <mark> mv /usr/local/etc/v2ray/config.json /usr/local/etc/v2ray/config_01.json </mark>                  #修改配置文件名

[root@martlet121 ~]# <mark> cp /usr/local/etc/v2ray/config_01.json /usr/local/etc/v2ray/config_02.json </mark>                 #多复制一个配置文件

[root@martlet121 ~]# <mark> vim /usr/local/etc/v2ray/config_01.json </mark>                 #只需修改日志路径和进程监听端口即可，其他配置一样

```json
{
  "log": {
    "loglevel": "warning",
    "access": "/var/log/v2ray/access_01.log",               //修改日志路径
    "error": "/var/log/v2ray/error_01.log"
  },
  "inbounds": [
    {
      "port": 20001,           //服务器监听端口
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

[root@martlet121 ~]# <mark> vim /usr/local/etc/v2ray/config_02.json </mark>                #只需修改日志路径和进程监听端口即可，其他配置一样

```json
{
  "log": {
    "loglevel": "warning",
    "access": "/var/log/v2ray/access_02.log",                //修改日志路径
    "error": "/var/log/v2ray/error_02.log"
  },
  "inbounds": [
    {
      "port": 20002,           //服务器监听端口
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

[root@martlet121 ~]# <mark> mv /etc/systemd/system/v2ray.service /etc/systemd/system/v2ray-01.service </mark>                  #修改服务启动文件名

[root@martlet121 ~]# <mark> cp /etc/systemd/system/v2ray-01.service /etc/systemd/system/v2ray-02.service </mark>                  #创建新的启动文件

[root@martlet121 ~]# <mark> vim /etc/systemd/system/v2ray-01.service </mark>                  #修改启动文件加载的配置文件

```
 11 ExecStart=/usr/local/bin/v2ray run -config /usr/local/etc/v2ray/config_01.json
```

[root@martlet121 ~]# <mark> vim /etc/systemd/system/v2ray-02.service </mark>                  #修改启动文件加载的配置文件

```
 11 ExecStart=/usr/local/bin/v2ray run -config /usr/local/etc/v2ray/config_02.json
```

[root@martlet121 ~]# <mark> systemctl daemon-reload </mark>                  #重启加载服务

[root@martlet121 ~]# <mark> systemctl start v2ray-01.service </mark>                  #启动服务

[root@martlet121 ~]# <mark> systemctl start v2ray-02.service </mark>                  #启动服务

[root@martlet121 ~]# <mark> systemctl enable v2ray-01.service </mark>                  #将服务加入开机启动

Created symlink /etc/systemd/system/multi-user.target.wants/v2ray-01.service → /etc/systemd/system/v2ray-01.service.

[root@martlet121 ~]# <mark> systemctl enable v2ray-02.service </mark>                  #将服务加入开机启动

Created symlink /etc/systemd/system/multi-user.target.wants/v2ray-02.service → /etc/systemd/system/v2ray-02.service.

[root@martlet121 ~]# <mark> netstat -anpt | grep 20001 </mark>                   #查看端口监听

tcp6       0      0 :::20001                :::*                    LISTEN      8053/v2ray

[root@martlet121 ~]# <mark> netstat -anpt | grep 20002 </mark>                  #查看端口监听

tcp6       0      0 :::20002                :::*                    LISTEN      8062/v2ray

[root@martlet121 ~]# 


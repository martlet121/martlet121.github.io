---
description: "不推荐，比tcp性能较差；和其他协议组合除外"
---

   不推荐，比tcp性能较差；和其他协议组合除外







一、配置v2ray服务端

[root@martlet121 ~]# <mark> vim /usr/local/etc/v2ray/config.json </mark>                          #修改主配置文件

```json
{
  "inbounds": [
    {
      "port": 20001,
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "6603eb89-d26e-46b2-a626-49e18e074a6e",
            "alterId": 0
          }
        ]
      },
      "streamSettings": {
        "network":"ws"                   //修改这里即可
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

[root@martlet121 ~]# <mark> systemctl restart v2ray </mark>                   #重启服务生效配置

[root@martlet121 ~]# <mark> ss -an |grep 20001 </mark>                   #查看端口监听

tcp   LISTEN 0      4096                                            *:20001                     *:*

[root@martlet121 ~]# 





二、客户端配置

​    打开客户端解压后路径config.json文件，编辑完成后运行v2ray.exe文件

```json
{
  "inbounds": [
    {
      "port": 1080,
      "protocol": "socks",
      "sniffing": {
        "enabled": true,
        "destOverride": ["http", "tls"]
      },
      "settings": {
        "auth": "noauth"
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "vmess",
      "settings": {
        "vnext": [
          {
            "address": "vpn.martlet121.cn",
            "port": 20001,
            "users": [
              {
                "id": "6603eb89-d26e-46b2-a626-49e18e074a6e",
                "alterId": 0
              }
            ]
          }
        ]
      },
      "streamSettings":{
        "network":"ws"               //修改对接类型
      }
    }
  ]
}
```


   动态变化通信端口，应对电信服务运营商可能会对长时间大流量的单个端口进行限速

​    vmess协议才支持动态端口特性；主要在服务端设置







一、服务器侧配置

[root@martlet121 ~]# <mark> vim /usr/local/etc/v2ray/config.json </mark>                     #修改服务器侧配置文件

```json
{
  "inbounds":[
  {
      "port": 10000,               //主端口配置
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "6603eb89-d26e-46b2-a626-49e18e074a6e",
            "alterId": 0
          }
        ],
        "detour": {
          "to": "dynamicPort"                    //绕行配置，客户端使用dynamicPort的配置通信
        }
      }
    },
    {
      "protocol": "vmess",
      "port": "20000-30000",               //协商后动态分配的端口范围
      "tag": "dynamicPort",                //与上面的detour to相同
      "settings": {
        "default": {
          "alterId": 0
        }
      },
      "allocate": {                     //分配模式
        "strategy": "random",                     //随机开启
        "concurrency": 3000,                     //同时开放的端口，最大不能超过端口范围的1/3，端口数量不能太少，要不无法并发
        "refresh": 3                        //每三分钟刷新一次
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

[root@martlet121 ~]# <mark> systemctl restart v2ray </mark>                    #重启服务应用配置

[root@martlet121 ~]# <mark> netstat -an | grep 10000 </mark>                       #查看监听的端口

tcp6       0      0 :::10000                :::*                    LISTEN

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
            "address": "45.76.177.113",
            "port": 10000,
            "users": [
              {
                "id": "6603eb89-d26e-46b2-a626-49e18e074a6e",
                "alterId": 0
              }
            ]
          }
        ]
      }
    }
  ]
}
```


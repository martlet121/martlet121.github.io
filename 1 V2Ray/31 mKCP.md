   快速重传的机制在高丢包率的网络下会耗费更多流量，但能提高访问效率

​    mKCP与KCPTUN同样是KCP协议，但两者并不兼容；UDP协议

​    只需在服务器的inbounds和客户端的outbounds添加一个streamSettings并设置成mkcp即可

​    客户端的上行uplinkCapacity对于服务器来说是下行downlinkCapacity，同样地客户端的下行downlinkCapacity是服务器的上行uplinkCapacity；速率由双方设置的最小值决定



| 数据包伪装类型 | 作用         |
| -------------- | ------------ |
| utp            | BT下载       |
| srtp           | 视频通话     |
| wechat-video   | 微信视频通话 |
| dtls           | dtls         |
| wireguard      | 新型VPN      |
| none           | 不伪装       |







一、服务器侧配置

[root@martlet121 ~]# <mark> vim /usr/local/etc/v2ray/config.json </mark>                     #修改服务器侧配置文件

```json
{
  "inbounds": [
    {
      "port": 16823,
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
        "network": "mkcp",                //此处的mkcp也可写成kcp，两种写法是起同样的效果
        "kcpSettings": {
          "uplinkCapacity": 10000,
          "downlinkCapacity": 10000,
          "congestion": true,
          "header": {
            "type": "none"
          }
        }
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

[root@martlet121 ~]# <mark> systemctl restart v2ray </mark>                   #重启服务应用配置

[root@martlet121 ~]# <mark> netstat -an | grep 16823 </mark>                  #mkcp监听的是udp端口

udp6       0      0 :::16823                :::*

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
            "port": 16823,
            "users": [
              {
                "id": "6603eb89-d26e-46b2-a626-49e18e074a6e",
                "alterId": 0
              }
            ]
          }
        ]
      },
      "streamSettings": {
        "network": "mkcp",              //网络的选择，写成kcp或mkcp都能启用mKCP
        "kcpSettings": {
          "uplinkCapacity": 10000,                 //上行链路容量，V2Ray向外发送数据包的速率。单位MB
          "downlinkCapacity": 10000,                //下行链路容量，V2Ray接收数据包的速率。单位 MB
          "congestion": true,
          "header": {                      //数据包的伪装
            "type": "none"                      //要伪装成的数据包类型，客户端与服务器要一致
          }
        }
      }
    }
  ]
}
```


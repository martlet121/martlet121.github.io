   匿名通信的自由软件，洋葱路由器（The Onion Router，TOR）

​    可通过Tor接入由全球志愿者免费提供，包含7000+个中继的覆盖网络，从而达至隐藏用户真实地址、避免网络监控及流量分析的目的；可保护个人隐私，不受监控地进行通信







一、服务端安装tor

[root@martlet121 ~]# <mark> yum -y install tor </mark>                       #安装tor路由

[root@martlet121 ~]# <mark> vim /etc/tor/torrc </mark>                 #修改tor主配置文件，在文件最末尾添加

```
259 ExcludeNodes {cn},{hk},{mo},{kp},{ir},{sy},{pk},{cu},{vn}
260 StrictNodes 1
```

[root@martlet121 ~]# <mark> systemctl enable tor --now </mark>               #启动tor服务并加入开机服务

Created symlink /etc/systemd/system/multi-user.target.wants/tor.service → /usr/lib/systemd/system/tor.service.

[root@martlet121 ~]# <mark> netstat -an | grep 9050 </mark>                    #默认监听127.0.0.1的9050端口

tcp        0      0 127.0.0.1:9050          0.0.0.0:*               LISTEN

[root@martlet121 ~]# 





二、服务端配置

[root@martlet121 ~]# <mark> vim /usr/local/etc/v2ray/config.json </mark>                      #修改服务器侧配置文件

```json
{
  "inbounds": [
    {
      "port": 10000,
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
        "network": "quic",
        "security": "none",
        "quicSettings": {
          "security": "aes-128-gcm",
          "key": "martlet121",
          "header": {
            "type": "wechat-video"
          }
        }
      }
    }
  ],
  "outbounds": [
          {
            "protocol": "socks",                 //只是出站改成了tor的配置；但不代表只有服务器能改，客户端也可以，其他方法较复杂，暂未研究
            "settings": {
                "servers": [
                    {
                        "address": "127.0.0.1",
                        "port": 9050
                    }
                ]
            }
        }
  ]
}
```

[root@martlet121 ~]# <mark> systemctl restart v2ray </mark>                   #重启服务应用配置

[root@martlet121 ~]# <mark> netstat -an | grep 10000 </mark>                      #查看监听的端口

udp6       0      0 :::10000                :::*

[root@martlet121 ~]#





三、客户端没改

​    打开客户端解压后路径config.json文件，编辑完成后运行v2ray.exe文件

```json
{
  "inbounds": [
    {
      "port": 1080,
      "listen": "127.0.0.1",
      "protocol": "socks",
      "sniffing": {
        "enabled": true,
        "destOverride": ["http", "tls"]
      },
      "settings": {
        "auth": "noauth",
        "udp": false
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
      },
      "streamSettings": {
        "network": "quic",               //网络的选择，quic表示启用QUIC
        "security": "none",               //这里的Security是对vmess加密的，quic传输时会强制开启tls，设置中未开启tls时，v2ray会自签发证书进行tls加密；所以这里设置成none没有关系
        "quicSettings": {               //quic相关参数；加密和伪装都不启用时，数据包为原始的QUIC数据包，可以和其它QUIC工具对接；为避免被探测必须至少开启一项
          "security": "aes-128-gcm",               //数据包的加密方式；默认值none（不加密），可选值为aes-128-gcm和chacha20-poly1305
          "key": "martlet121",               //加密时所用的密钥，只有security不为none时，key才生效
          "header": {              //设置数据包的伪装
            "type": "wechat-video"               //要伪装成的数据包类型
          }
        }
      }
    }
  ]
}
```


   4.7版本开始支持QUIC（Quick UDP Internet Connection），Google提出的使用UDP进行多路并发传输的协议



主要优势

​    1、减少握手的延迟（1-RTT或0-RTT）

​    2、多路复用，并且没有TCP的阻塞问题

​    3、连接迁移，客户端由Wifi转移到4G时，连接不会断开



| 数据包伪装类型 | 作用         |
| -------------- | ------------ |
| utp            | BT下载       |
| srtp           | 视频通话     |
| wechat-video   | 微信视频通话 |
| dtls           | dtls         |
| wireguard      | 新型VPN      |
| none           | 不伪装       |







一、服务端

[root@martlet121 ~]# <mark> vim /usr/local/etc/v2ray/config.json </mark>                     #修改服务器侧配置文件

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
      "protocol": "freedom",
      "settings": {}
    }
  ]
}
```

[root@martlet121 ~]# <mark> systemctl restart v2ray </mark>                   #重启服务应用配置

[root@martlet121 ~]# <mark> netstat -an | grep 10000 </mark>                      #查看监听的端口

udp6       0      0 :::10000                :::*

[root@martlet121 ~]#





二、客户端

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


---
description: "目前大多数网页是HTTP/1.1，HTTP/2是HTTP/1.1的升级版，简称h2"
---

   目前大多数网页是HTTP/1.1，HTTP/2是HTTP/1.1的升级版，简称h2

​    使用HTTP/2要开启TLS



<mark> 未成功 </mark> 







一、申请证书

​    前提是有自己的证书，并添加解析到服务器，已提前设置好

[root@martlet121 ~]# <mark> dnf -y install openssl curl cron </mark>                 #安装依赖包

[root@martlet121 ~]# <mark> dnf -y install socat </mark>                #安装依赖包

[root@martlet121 ~]# <mark> curl https://get.acme.sh | sh </mark>               #安装生成证书的脚本命令

[root@martlet121 ~]# <mark> ./.acme.sh/acme.sh --register-account -m hhh@martlet121.cn </mark>                     #注册账号

[root@martlet121 ~]# <mark> ./.acme.sh/acme.sh --issue -d vps.martlet121.cn --standalone --keylength ec-256 --force </mark>                  #申请证书，默认有效期只有3个月

| 参数        | 作用                                                         |
| ----------- | ------------------------------------------------------------ |
| --keylength | 密钥长度；字段中有ec表示生成ECC证书，否则就是RSA证书可取值ec-256、ec-384、2048、3072、4096、8192 |

[root@martlet121 ~]# <mark> ./.acme.sh/acme.sh --installcert -d vps.martlet121.cn --ecc --fullchain-file /usr/local/etc/v2ray/v2ray.crt --key-file /usr/local/etc/v2ray/v2ray.key </mark>                     #安装证书和密钥到v2ray的配置文件同级目录，v2ray.key是私钥文件，不能泄露

[root@martlet121 ~]# <mark> chmod 777 /usr/local/etc/v2ray/v2ray.* </mark>                      #修改证书文件权限





二、服务器侧配置

[root@martlet121 ~]# <mark> vim /usr/local/etc/v2ray/config.json </mark>                     #修改服务器侧配置文件

```json
{
  "inbounds": [
    {
      "port": 443,
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
        "network": "h2",               //h2也可写成http，效果一样
        "httpSettings": {              //HTTP2的设置
          "path": "/ray"
        },
        "security": "tls",              //开启tls
        "tlsSettings": {
          "certificates": [
            {
              "certificateFile": "/usr/local/etc/v2ray/v2ray.crt",               //证书文件，详见tls小节
              "keyFile": "/usr/local/etc/v2ray/v2ray.key"               //密钥文件
            }
          ]
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

[root@martlet121 ~]# <mark> ss -anpt | grep 443 </mark>                  #查看端口监听

LISTEN 0      4096               *:443               **:**     users:(("v2ray",pid=64490,fd=3))

[root@martlet121 ~]#





三、客户端配置

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
            "address": "vps.martlet121.cn",
            "port": 443,
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
        "network": "h2",
        "httpSettings": {             //HTTP2设置
          "path": "/ray"
        },
        "security": "tls"
      }
    }
  ]
}
```


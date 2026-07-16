---
description: "HaProxy监听443端口，处理TLS之后，将HTTP流量交由Web服务器处理，非HTTP流量交由V2Ray按Vmess处理"
---

   HaProxy监听443端口，处理TLS之后，将HTTP流量交由Web服务器处理，非HTTP流量交由V2Ray按Vmess处理

​    主动侦测会得到正常HTTP网站响应，方便伪装，被广泛用于反审查

​    Vmess + TCP + TLS（当前方法）延迟低于Vmess + WSS



该方法的隐蔽性是否比wss低？

​    中间人看来，该方法在建立 TLS 连接后，比 wss 少一次握手，即 TLS 建立后直接发送请求并获得响应，该行为是符合正常的 HTTPS 请求的。

​    主动探测时，如 TLS 建立后发送 HTTP 请求，则被发给 Web 服务器按正常 HTTP 请求处理。如发送非 HTTP 请求，会被发给 V2Ray 处理，如 Vmess 认证失败，连接将被关闭，向 HTTPS 服务器发送非 HTTPS 请求，连接被关闭是正常的行为。







一、配置haproxy

[root@martlet121 ~]# <mark> dnf -y install haproxy </mark>                        #hapoxy要大于1.8.15，openssl版本大于1.1.1，才能支持TLS1.3

[root@martlet121 ~]# <mark> cd /usr/local/etc/v2ray/ </mark>                    #进入保存了证书的目录，证书的生成参考TLS章节

[root@martlet121 v2ray]# <mark> cat v2ray.crt v2ray.key > vpn.martlet121.cn.pem </mark>                          #HaProxy的证书和密钥可以放在同一个文件

[root@martlet121 v2ray]# <mark> chmod 777 vpn.martlet121.cn.pem </mark>                       #给新的证书文件加权限

[root@martlet121 v2ray]# <mark> cd </mark>                        #回家目录

[root@martlet121 ~]# <mark> vim /etc/haproxy/haproxy.cfg </mark>                          #修改主配置文件

```
global
    log /dev/log local0
    log /dev/log local1 notice
    chroot /var/lib/haproxy
    #stats socket /run/haproxy/admin.sock mode 660 level admin expose-fd listeners
    stats timeout 30s
    user haproxy
    group haproxy
    daemon
    ca-base /etc/ssl/certs
    crt-base /etc/ssl/private
    #仅使用支持FS和AEAD的加密套件
    ssl-default-bind-ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384
    ssl-default-bind-ciphersuites TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256
    ssl-default-bind-options no-sslv3 no-tlsv10 no-tlsv11                        #禁用TLS 1.2之前的TLS
    tune.ssl.default-dh-param 2048
defaults
    log global
    mode tcp                        #使用tcp模式
    option dontlognull
    timeout connect 5s
    timeout client  300s                       #空闲连接等待时间，这里使用与V2Ray默认connIdle一致的300s
    timeout server  300s
frontend tls-in
    bind *:443 tfo ssl crt /usr/local/etc/v2ray/vpn.martlet121.cn.pem                            #监听443 tls，tfo根据自身情况决定是否开启，修改证书目录
    tcp-request inspect-delay 5s
    tcp-request content accept if HTTP
    use_backend web if HTTP                       #将HTTP流量发给web后端
    default_backend vmess                          #将其他流量发给vmess后端
backend web
    server server1 127.0.0.1:8080
backend vmess
    server server1 127.0.0.1:20001
```

[root@martlet121 ~]# <mark> systemctl restart haproxy </mark>                          #重启服务应用配置

[root@martlet121 ~]# <mark> ss -an |grep 443 </mark>                      #查看端口监听

tcp   LISTEN 0      4096                                      0.0.0.0:443                           0.0.0.0:*

[root@martlet121 ~]#





二、配置nginx

[root@martlet121 ~]# <mark> dnf -y install nginx </mark>                         #安装nginx

[root@martlet121 ~]# <mark> vim /etc/nginx/nginx.conf </mark>                          #修改主配置文件

```
 38     server {
 39         listen       8080;                     #修改监听端口
 40         listen       [::]:8080;
 41         server_name  vpn.martlet121.cn;                   #修改域名
 42         root         /usr/share/nginx/html;
 54     }
```

[root@martlet121 ~]# <mark> systemctl restart nginx </mark>                          #重启服务应用配置

[root@martlet121 ~]# <mark> ss -an |grep 8080 </mark>                     #查看端口监听

tcp   LISTEN   0      511                                       0.0.0.0:8080                0.0.0.0:*

tcp   LISTEN   0      511                                          [::]:8080                   [::]:*

[root@martlet121 ~]#





三、配置v2ray服务端

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
        "network": "tcp"
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

[root@martlet121 ~]# <mark> systemctl restart v2ray </mark>                          #重启服务应用配置

[root@martlet121 ~]# <mark> ss -an |grep 20001 </mark>                     #查看端口监听

tcp   LISTEN    0      4096                                            *:20001                     *:*

[root@martlet121 ~]#





四、客户端配置

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
            "address": "vpn.martlet121.cn",                //tls需要域名，所以这里应该填自己的域名
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
        "network": "tcp",
        "security": "tls"            //客户端的security也要设置为tls
      }
    }
  ]
}
```





五、验证

​    此时客户端代理正常，未通过代理的流量测试（直接访问域名），能看到正常的网站页面


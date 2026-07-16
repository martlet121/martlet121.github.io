---
description: "TCP + TLS + Web的简易实现，不用关心HaProxy和OpenSSL的版本，不用自己申请证书，不用安装Web服务器"
---

   TCP + TLS + Web的简易实现，不用关心HaProxy和OpenSSL的版本，不用自己申请证书，不用安装Web服务器

​    TLS 分流器项目：https://github.com/liberal-boy/tls-shunt-proxy#%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85







一、安装配置TLS 分流器

[root@martlet121 ~]# <mark> bash <(curl -L -s https://raw.githubusercontent.com/liberal-boy/tls-shunt-proxy/master/dist/install.sh) </mark>                 #下载并安装分流器

https://github.com/liberal-boy/tls-shunt-proxy/releases/download/0.8.1/tls-shunt-proxy.zip

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current

​                                 Dload  Upload   Total   Spent    Left  Speed

  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0

100 4871k  100 4871k    0     0  5758k      0 --:--:-- --:--:-- --:--:-- 15.7M

Archive:  /tmp/tls-shunt-proxy/tls-shunt-proxy.zip

  inflating: /usr/local/bin/tls-shunt-proxy

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current

​                                 Dload  Upload   Total   Spent    Left  Speed

100   494  100   494    0     0   1159      0 --:--:-- --:--:-- --:--:--  1156

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current

​                                 Dload  Upload   Total   Spent    Left  Speed

100  3965  100  3965    0     0  12125      0 --:--:-- --:--:-- --:--:-- 12162

[root@martlet121 ~]# <mark> mkdir -p /var/www/html </mark>                #创建网站根目录

[root@martlet121 ~]# <mark> echo "test" > /var/www/html/index.html </mark>             #创建测试文件

[root@martlet121 ~]# <mark> vim /etc/tls-shunt-proxy/config.yaml </mark>                          #修改主配置文件

```
listen: 0.0.0.0:443
vhosts:
  - name: vpn.martlet121.cn                  #网站域名
    tlsoffloading: true
    managedcert: true                 #自动申请证书
    alpn: h2,http/1.1
    protocols: tls12,tls13                  #如果不需要兼容tls12, 可改为tls13
    http:
      handler: fileServer
      args: /var/www/html                  #静态网站目录
    default:
      handler: proxyPass
      args: 127.0.0.1:20001                 #其他流量转发给V2Ray
```

[root@martlet121 ~]# <mark> systemctl restart tls-shunt-proxy </mark>              #重启服务生效

[root@martlet121 ~]# <mark> ss -an |grep 443 </mark>                        #查看端口监听

tcp   LISTEN   0      4096                                            *:443                               *:*

[root@martlet121 ~]# 





二、配置v2ray服务端

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





三、客户端配置

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





四、验证

​    此时客户端代理正常，未通过代理的流量测试（直接访问域名），能看到正常的网站页面


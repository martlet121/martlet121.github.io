   相较于TCP方式，Domain Socket更高效，速度超过50M后会有比较明显的性能差距

​    客户端连服务器仍要使用TCP，分流器与服务端V2Ray连接才能用Domain Socket，下图示意

​                        TLS over TCP                 DS

客户端 V2Ray --------------- TLS 分流器 -------- 服务端 V2Ray



<mark> 未配置成功 </mark> 







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

[root@martlet121 ~]# <mark> vim /etc/tls-shunt-proxy/config.yaml </mark>                           #修改主配置文件

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
      args: unix:@v2ray.sock                 #其他流量转发给V2Ray
```

[root@martlet121 ~]# <mark> systemctl restart tls-shunt-proxy </mark>              #重启服务生效

[root@martlet121 ~]# <mark> ss -an |grep 443 </mark>                       #查看端口监听

tcp   LISTEN   0      4096                                            *:443                               *:*

[root@martlet121 ~]# 





二、配置v2ray服务端

[root@martlet121 ~]# <mark> vim /usr/local/etc/v2ray/config.json </mark>                           #修改主配置文件

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
        "network": "ds",
                "dsSettings": {
                "path": "@v2ray.sock",                  //调用前面的v2ray.sock
                "abstract": true
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

[root@martlet121 ~]# <mark> systemctl restart v2ray </mark>                          #重启服务应用配置

[root@martlet121 ~]# <mark> ss -an |grep 20001 </mark>                      #查看端口监听

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

​    未配置成功，访问失败
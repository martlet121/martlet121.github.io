   若局域网内设备要通过http代理才能联网，可使用前置代理来先连接http代理联网后，再通过V2Ray访问外网

​    V2ray 4.21.0+版本开始支持http前置代理；V2ray 4.21.1+版本开始支持https前置代理

​    HTTP代理服务器只能看到加密的流量

​    前置代理只需在客户端中设置



<mark> 没配成功，国内也访问不了 </mark> 







一、squid代理服务器设置

1、系统配置

[root@martlet121 ~]# <mark> systemctl stop firewalld.service </mark>                    #停止防火墙

[root@martlet121 ~]# <mark> systemctl disable firewalld.service </mark>                    #关闭开机启动

Removed "/etc/systemd/system/multi-user.target.wants/firewalld.service".

Removed "/etc/systemd/system/dbus-org.fedoraproject.FirewallD1.service".

[root@martlet121 ~]# <mark> setenforce 0 </mark>                     #临时关闭selinux

[root@martlet121 ~]# <mark> sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/sysconfig/selinux </mark>                  #永久关闭SELinux

[root@martlet121 ~]# <mark> echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf </mark>                      #永久开启数据包转发功能

[root@martlet121 ~]# <mark> sysctl -p </mark>                   #立即生效

net.ipv4.ip_forward = 1

[root@martlet121 ~]# <mark> route -n </mark>                         #软路由默认所有流量指向真实路由器

Kernel IP routing table

Destination     Gateway         Genmask         Flags Metric Ref    Use Iface

0.0.0.0         192.168.1.1     0.0.0.0         UG    100    0        0 ens33                            #桥接网卡默认连外网路由

192.168.1.0     0.0.0.0         255.255.255.0   U     100    0        0 ens33

192.168.5.0     0.0.0.0         255.255.255.0   U     101    0        0 ens36                      #仅主机网络；客户端在此网络内，默认只能局域网通信，无法访问其他网络

192.168.122.0   0.0.0.0         255.255.255.0   U     0      0        0 virbr0

[root@martlet121 ~]#



2、配置squid

[root@martlet121 ~]# <mark> yum -y install squid </mark>                      #安装代理软件

[root@martlet121 ~]# <mark> systemctl enable squid </mark>                #加入开机启动

Created symlink from /etc/systemd/system/multi-user.target.wants/squid.service to /usr/lib/systemd/system/squid.service.

[root@martlet121 ~]# <mark> systemctl restart squid </mark>                 #安装后直接启动即可，默认监听tcp3128端口；客户端浏览器配置正向代理后即可通信，此时不用配置，v2ray客户端配置文件中会设置





二、服务器侧配置

[root@martlet121 ~]# <mark> vim /usr/local/etc/v2ray/config.json </mark>                      #修改服务器侧配置文件

```json
{
  "inbounds": [
    {
      "port": 20000,           //服务器监听端口
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

[root@martlet121 ~]# <mark> systemctl restart v2ray </mark>                   #重启服务应用配置

[root@martlet121 ~]# <mark> ss -anpt | grep 20000 </mark>                  #查看端口监听

LISTEN 0      4096               *:20000              **:**     users:(("v2ray",pid=5025,fd=3))

[root@martlet121 ~]#





三、客户端配置

​    此时客户端在仅主机网络内，网络能连到squid服务器，但无法访问外网

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
            "port": 20000,                  //服务器端口
            "users": [
              {
                "id": "6603eb89-d26e-46b2-a626-49e18e074a6e",                      //用户ID，必须与服务器端配置相同；客户端使用此ID加密后再传给服务端
                "alterId": 0                  //此处的值也应当与服务器相同，v4.28.1版本之后必须设置为0以启用VMessAEAD
              }
            ]
          }
        ]
      },
      "tag": "VMESS",
      "proxySettings": {
          "tag": "HTTP"  
        }
    },
    {
      "protocol": "http",
      "settings": {
        "servers": [
          {
            "address": "192.168.5.160",               //squid服务器IP
            "port": 3128,              //服务器端口
            "users": [
              {
                "user": "",           //认证用户名
                "pass": ""            //认证密码
              }
            ]
          }
        ]
      },
      "streamSettings": {
        "security": "tls",
        "tlsSettings": {
          "allowInsecure": false         //是否检测证书有效性,在自定义证书的情况开可以开启(false改为true)这个
        }
      },
      "tag": "HTTP"
    }
  ]
}
```


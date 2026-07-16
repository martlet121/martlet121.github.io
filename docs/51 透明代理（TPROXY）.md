---
description: "TPROXY可以透明代理IPV6"
---

   TPROXY可以透明代理IPV6

​    本章节解决了DNS分流和国内外访问分流的问题

![文章配图](<./files/51 透明代理（TPROXY）/1.png>)

[透明代理.vsdx](<./files/51 透明代理（TPROXY）/透明代理.vsdx>)







一、v2ray服务端配置

[root@martlet121 ~]# <mark> uuidgen </mark>               #随机一个uuid，客户端要通过uuid来连接服务器

6603eb89-d26e-46b2-a626-49e18e074a6e

[root@martlet121 ~]# <mark> vim /usr/local/etc/v2ray/config.json </mark>                 #修改配置文件

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
            "alterId": 0,                //v4.28.1版本之后必须设置为0以启用VMessAEAD
            "method": "aes-128-gcm",                    //vmess配合此加密协议速度最快
            "password": "martlet121"
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

[root@martlet121 ~]# <mark> systemctl restart v2ray </mark>                 #修改配置后要重启生效

[root@martlet121 ~]# <mark> systemctl enable v2ray </mark>                #加入开机启动

[root@martlet121 ~]# <mark> netstat -an | grep 20000 </mark>                #查看端口监听

tcp6       0      0 :::20000                :::*                    LISTEN

[root@martlet121 ~]#





二、Linux软路由配置

1、系统配置

[root@martlet121 ~]# <mark> uname -a </mark>                     #查看系统内核版本

Linux martlet121 5.14.0-480.el9.x86_64 #1 SMP PREEMPT_DYNAMIC Fri Jul 12 20:45:27 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux

[root@martlet121 ~]# <mark> cat /etc/redhat-release </mark>                   #查看操作系统版本

CentOS Stream release 9

[root@martlet121 ~]# <mark> systemctl stop firewalld.service </mark>                     #停止防火墙

[root@martlet121 ~]# <mark>  systemctl disable firewalld.service </mark>                    #关闭开机启动

Removed "/etc/systemd/system/multi-user.target.wants/firewalld.service".

Removed "/etc/systemd/system/dbus-org.fedoraproject.FirewallD1.service".

[root@martlet121 ~]# <mark> setenforce 0 </mark>                     #临时关闭selinux

[root@martlet121 ~]# <mark> sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/sysconfig/selinux </mark>                 #永久关闭SELinux

[root@martlet121 ~]# <mark> echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf </mark>                      #永久开启数据包转发功能

[root@martlet121 ~]# <mark> echo "net.ipv6.conf.all.forwarding = 1" >> /etc/sysctl.conf </mark>                      #永久开启数据包转发功能

[root@martlet121 ~]# <mark> sysctl -p </mark>                   #立即生效

net.ipv4.ip_forward = 1

[root@martlet121 ~]# <mark> route -n </mark>                        #软路由默认所有流量指向真实路由器

Kernel IP routing table

Destination     Gateway         Genmask         Flags Metric Ref    Use Iface

0.0.0.0         192.168.1.1     0.0.0.0         UG    100    0        0 ens160

192.168.1.0     0.0.0.0         255.255.255.0   U     100    0        0 ens160

[root@martlet121 ~]#



2、v2ray客户端配置

[root@martlet121 ~]# <mark> ll </mark>                #将从仓库下载的安装包及脚本上传到本地

-rw-r--r--. 1 root root    22454  8月 22 22:43 install-release.sh

-rw-r--r--. 1 root root 12486240  8月 22 22:43 v2ray-linux-64.zip

[root@martlet121 ~]# <mark> bash install-release.sh --local v2ray-linux-64.zip </mark>                   #指定本地文件进行安装

[root@martlet121 ~]# <mark> vim /usr/local/etc/v2ray/config.json </mark>                        #修改主配置文件

```json
{
  "inbounds": [
    {
      "tag":"transparent",
      "port": 12345,                //接收局域网流量的端口号
      "protocol": "dokodemo-door",                //此协议是接收iptables传入的局域网流量
      "settings": {
        "network": "tcp,udp",
        "followRedirect": true               //这里要为true才能接受来自iptables的流量
      },
      "sniffing": {
        "enabled": true,
        "destOverride": [
          "http",
          "tls"
        ]
      },
      "streamSettings": {
        "sockopt": {
          "tproxy": "tproxy",              //透明代理使用TPROXY方式
          "mark":255
        }
      }
    },
    {
      "port": 1080,                 //本地监听端口，浏览器配置的代理端口
      "protocol": "socks",               //本地代理入口协议为SOCKS 5
      "sniffing": {                     //流量探测，根据指定的流量类型，重置所请求的目标；识别域名后应用域名路由规则、解决dns污染、可识别BT协议再处理
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
      "tag": "proxy",
      "protocol": "vmess",            //指定连代理服务器的出口协议
      "settings": {
        "vnext": [
          {
            "address": "45.76.177.113",                   //服务器地址，也可用ipv6地址，看哪个延时低用哪个
            "port": 20000,                  //服务器端口
            "users": [
              {
                "id": "6603eb89-d26e-46b2-a626-49e18e074a6e",                      //用户ID，必须与服务器端配置相同；客户端使用此ID加密后再传给服务端
                "alterId": 0,                  //此处的值也应当与服务器相同，v4.28.1版本之后必须设置为0以启用VMessAEAD
                "method": "aes-128-gcm",                    //vmess配合此加密协议速度最快
                "password": "martlet121"
              }
            ]
          }
        ]
      },
      "streamSettings": {
        "sockopt": {
          "mark": 255               //SO_MARK，用于iptables规则识别，每个outbound都要配置成一样的值，若不为255时，此处和iptables同步修改
        }
      },
      "mux": {
        "enabled": true
      }
    },
    {
      "tag": "direct",
      "protocol": "freedom",
      "settings": {
        "domainStrategy": "UseIP"                //避免直连时使用本机dns出现解析问题
      },
      "streamSettings": {
        "sockopt": {
          "mark": 255               //SO_MARK，用于iptables规则识别，每个outbound都要配置成一样的值，若不为255时，此处和iptables同步修改
        }
      }
    },
    {
      "tag": "block",
      "protocol": "blackhole",
      "settings": {
        "response": {
          "type": "http"
        }
      }
    },
    {
      "tag": "dns-out",
      "protocol": "dns",
      "streamSettings": {
        "sockopt": {
          "mark": 255               //SO_MARK，用于iptables规则识别，每个outbound都要配置成一样的值，若不为255时，此处和iptables同步修改
        }
      }
    }
  ],
  "dns": {
    "servers": [
      {
        "address": "114.114.114.114",             //中国大陆域名使用阿里的DNS
        "port": 53,
        "domains": [
          "geosite:cn",
          "ntp.org",             //设置解析NTP服务器域名使用此dns
          "vps.martlet121.cn"                //设为VPS域名；NTP和VPS用国内DNS解析，要是用国外DNS解析的话，连不上国外DNS则无法解析，无法解析则无法同步时间且连不上vps，死循环了
        ]
      },
      {
        "address": "223.5.5.5",               //中国大陆域名设阿里的DNS服务器备份
        "port": 53,
        "domains": [
          "geosite:cn",
          "ntp.org",             //设置解析NTP服务器域名使用此dns
          "vps.martlet121.cn"               //设为VPS域名；NTP和VPS用国内DNS解析
        ]
      },
      {
        "address": "8.8.8.8",               //非中国大陆域名使用Google的DNS解析
        "port": 53,
        "domains": [
          "geosite:geolocation-!cn"
        ]
      },
      {
        "address": "1.1.1.1",                //非中国大陆域名使用Cloudflare的DNS备份
        "port": 53,
        "domains": [
          "geosite:geolocation-!cn"
        ]
      }
    ]
  },
  "routing": {
    "domainStrategy": "IPOnDemand",
    "rules": [
      {
        "type": "field",
        "inboundTag": [
          "transparent"
        ],
        "port": 53,
        "network": "udp",
        "outboundTag": "dns-out"                  //劫持53端口UDP流量，使用V2Ray的DNS
      },
      {
        "type": "field",
        "inboundTag": [
          "transparent"
        ],
        "port": 123,
        "network": "udp",
        "outboundTag": "direct"               //直连123端口UDP流量（NTP 协议）
      },
      {
        "type": "field",
        "ip": [
          "223.5.5.5",
          "114.114.114.114"
        ],
        "outboundTag": "direct"          //让国内DNS服务器地址直连出去，不经过代理可实现DNS分流
      },
      {
        "type": "field",
        "ip": [
          "8.8.8.8",
          "1.1.1.1"
        ],
        "outboundTag": "proxy"            //让国外DNS服务器地址走代理，可实现DNS分流
      },
      {
        "type": "field",
        "domain": [
          "geosite:category-ads-all"
        ],
        "outboundTag": "block"              //广告拦截
      },
      {
        "type": "field",
        "protocol":["bittorrent"],
        "outboundTag": "direct"             //BT流量直连
      },
      {
        "type": "field",
        "ip": [
          "geoip:private",
          "geoip:cn"
        ],
        "outboundTag": "direct"                //直连中国大陆主流网站ip和保留ip
      },
      {
        "type": "field",
        "domain": [
          "geosite:cn"
        ],
        "outboundTag": "direct"                 //直连中国大陆主流网站域名
      }
    ]
  }
}
```

[root@martlet121 ~]# <mark> systemctl restart v2ray </mark>                    #重启服务应用配置

[root@martlet121 ~]# <mark> systemctl enable v2ray </mark>                #加入开机启动

Created symlink /etc/systemd/system/multi-user.target.wants/v2ray.service → /etc/systemd/system/v2ray.service.

[root@martlet121 ~]# <mark> netstat -anpt </mark>                     #查看端口监听

Active Internet connections (servers and established)

Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name

tcp6       0      0 :::1080                 :::*                    LISTEN      3184/v2ray 

tcp6       0      0 :::12345                :::*                    LISTEN      3184/v2ray 

[root@martlet121 ~]# <mark> curl -x socks5://127.0.0.1:1080 google.com </mark>                     #测试网关访问外网是否正常，下面回显表示能正常通过代理访问

```html
<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>301 Moved</TITLE></HEAD><BODY>
<H1>301 Moved</H1>
The document has moved
<A HREF="http://www.google.com/">here</A>.
</BODY></HTML>
```

[root@martlet121 ~]# 



3、iptables配置（ipv4规则）

[root@martlet121 ~]#                  #下面命令直接贴到服务器中即可

```bash
#设置策略路由
ip rule add fwmark 1 table 100 
ip route add local 0.0.0.0/0 dev lo table 100

#代理局域网设备
iptables -t mangle -N V2RAY
iptables -t mangle -A V2RAY -d 127.0.0.1/32 -j RETURN
iptables -t mangle -A V2RAY -d 224.0.0.0/4 -j RETURN 
iptables -t mangle -A V2RAY -d 255.255.255.255/32 -j RETURN 
iptables -t mangle -A V2RAY -d 192.168.0.0/16 -p tcp -j RETURN                 #直连局域网，避免V2Ray无法启动时无法SSH连网关
iptables -t mangle -A V2RAY -d 192.168.0.0/16 -p udp ! --dport 53 -j RETURN                #直连局域网，53端口除外（因为要使用V2Ray的DNS)
iptables -t mangle -A V2RAY -j RETURN -m mark --mark 0xff                  #直连SO_MARK为0xff的流量（0xff是255的16进制数），此规则目的是避免代理本机流量出现环路（https://github.com/v2ray/v2ray-core/issues/2621）
iptables -t mangle -A V2RAY -p udp -j TPROXY --on-ip 127.0.0.1 --on-port 12345 --tproxy-mark 1             #给UDP打标记1，转发至12345端口
iptables -t mangle -A V2RAY -p tcp -j TPROXY --on-ip 127.0.0.1 --on-port 12345 --tproxy-mark 1              #给TCP打标记1，转发至12345端口
iptables -t mangle -A PREROUTING -j V2RAY               #应用规则

#代理网关本机
iptables -t mangle -N V2RAY_MASK 
iptables -t mangle -A V2RAY_MASK -d 224.0.0.0/4 -j RETURN 
iptables -t mangle -A V2RAY_MASK -d 255.255.255.255/32 -j RETURN 
iptables -t mangle -A V2RAY_MASK -d 192.168.0.0/16 -p tcp -j RETURN                 #直连局域网
iptables -t mangle -A V2RAY_MASK -d 192.168.0.0/16 -p udp ! --dport 53 -j RETURN                  #直连局域网，53端口除外（因为要使用V2Ray的DNS）
iptables -t mangle -A V2RAY_MASK -j RETURN -m mark --mark 0xff                 #直连SO_MARK为0xff的流量（0xff是255的16进制数），此规则目的是避免代理本机流量出现环路
iptables -t mangle -A V2RAY_MASK -p udp -j MARK --set-mark 1              #给UDP打标记，重路由；在OUTPUT链打标记会使相应的包重路由到PREROUTING链上，以此实现UDP透明代理
iptables -t mangle -A V2RAY_MASK -p tcp -j MARK --set-mark 1               #给TCP打标记，重路由
iptables -t mangle -A OUTPUT -j V2RAY_MASK              #应用规则

#新建DIVERT规则，避免已有连接的包二次通过TPROXY，理论上有一定的性能提升
iptables -t mangle -N DIVERT
iptables -t mangle -A DIVERT -j MARK --set-mark 1
iptables -t mangle -A DIVERT -j ACCEPT
iptables -t mangle -I PREROUTING -p tcp -m socket -j DIVERT
```

[root@martlet121 ~]#



4、ip6tables配置（ipv6规则）

[root@martlet121 ~]#                  #下面命令直接贴到服务器中即可

```bash
# 策略路由
ip -6 rule add fwmark 1 table 106
ip -6 route add local ::/0 dev lo table 106
# 局域网设备代理
ip6tables -t mangle -N V2RAY6
ip6tables -t mangle -A V2RAY6 -d ::1/128 -j RETURN
ip6tables -t mangle -A V2RAY6 -d fc00::/7 -j RETURN
ip6tables -t mangle -A V2RAY6 -d fe80::/10 -j RETURN
ip6tables -t mangle -A V2RAY6 -d ff00::/8 -j RETURN
ip6tables -t mangle -A V2RAY6 -d ff00::/8 -p udp ! --dport 53 -j RETURN
ip6tables -t mangle -A V2RAY6 -j RETURN -m mark --mark 0xff
ip6tables -t mangle -A V2RAY6 -p udp -j TPROXY --on-ip ::1 --on-port 12345 --tproxy-mark 1
ip6tables -t mangle -A V2RAY6 -p tcp -j TPROXY --on-ip ::1 --on-port 12345 --tproxy-mark 1
ip6tables -t mangle -A PREROUTING -j V2RAY6
# 网关本机代理
ip6tables -t mangle -N V2RAY6_MASK
ip6tables -t mangle -A V2RAY6_MASK -d ::1/128 -j RETURN
ip6tables -t mangle -A V2RAY6_MASK -d fc00::/7 -j RETURN
ip6tables -t mangle -A V2RAY6_MASK -d fe80::/10 -j RETURN
ip6tables -t mangle -A V2RAY6_MASK -d ff00::/8 -j RETURN
ip6tables -t mangle -A V2RAY6_MASK -d ff00::/8 -p udp ! --dport 53 -j RETURN
ip6tables -t mangle -A V2RAY6_MASK -j RETURN -m mark --mark 0xff
ip6tables -t mangle -A V2RAY6_MASK -p udp -j MARK --set-mark 1
ip6tables -t mangle -A V2RAY6_MASK -p tcp -j MARK --set-mark 1
ip6tables -t mangle -A OUTPUT -j V2RAY6_MASK
# DIVERT规则
ip6tables -t mangle -N DIVERT6
ip6tables -t mangle -A DIVERT6 -j MARK --set-mark 1
ip6tables -t mangle -A DIVERT6 -j ACCEPT
ip6tables -t mangle -I PREROUTING -p tcp -m socket -j DIVERT6
```

[root@martlet121 ~]#



5、开启自动加载iptables和ip6tables的透明代理规则

[root@martlet121 ~]# <mark> mkdir -p /etc/iptables && iptables-save > /etc/iptables/v2ray.iptables && ip6tables-save > /etc/iptables/v2ray.ip6tables </mark>                  #创建目录并保存当前iptables配置到v2ray.iptables文件中

[root@martlet121 ~]# <mark> vim /etc/systemd/system/tproxyrule.service </mark>                    #创建服务启动文件

```
[Unit]
Description=Tproxy rule
After=network.target
Wants=network.target
[Service]
Type=oneshot
RemainAfterExit=yes
#注意分号前后要有空格
ExecStart=/sbin/ip rule add fwmark 1 table 100 ; /sbin/ip route add local 0.0.0.0/0 dev lo table 100 ; /sbin/iptables-restore /etc/iptables/v2ray.iptables ; /sbin/ip -6 rule add fwmark 1 table 106 ; /sbin/ip -6 route add local ::/0 dev lo table 106 ; /sbin/ip6tables-restore /etc/iptables/v2ray.ip6tables
ExecStop=/sbin/ip rule del fwmark 1 table 100 ; /sbin/ip route del local 0.0.0.0/0 dev lo table 100 ; /sbin/iptables -t mangle -F ; 
/sbin/ip -6 rule del fwmark 1 table 106 ; /sbin/ip -6 route del local ::/0 dev lo table 106 ; /sbin/ip6tables -t mangle -F
[Install]
WantedBy=multi-user.target
```

[root@martlet121 ~]# <mark> systemctl enable tproxyrule </mark>                    #将新创建的服务启动文件，以服务形式加入到开机启动中；就是建了软链接

Created symlink /etc/systemd/system/multi-user.target.wants/tproxyrule.service → /etc/systemd/system/tproxyrule.service.

[root@martlet121 ~]#



6、配置优化

​    解决UDP透明代理时出现的too many open files报错，此为超过最大文件描述符限制，添加下面两个配置项即可

[root@martlet121 ~]# <mark> vim /etc/systemd/system/v2ray.service </mark>                         #修改v2ray服务启动文件

```
  6 [Service]
 14 LimitNPROC=500
 15 LimitNOFILE=1000000
```

 [root@martlet121 ~]# <mark> systemctl daemon-reload && systemctl restart v2ray </mark>                       #读取新文件并重启服务生效



7、网关地址查看

[root@martlet121 ~]# <mark> ip a </mark>               #就是软路由自己的ip地址

2: ens160:  mtu 1500 qdisc fq_codel state UP group default qlen 1000

​    link/ether 00:0c:29:36:1d:e2 brd ff:ff:ff:ff:ff:ff

​    altname enp3s0

​    inet 192.168.1.254/24 brd 192.168.1.255 scope global noprefixroute ens160

​       valid_lft forever preferred_lft forever

​    inet6 2409:8a62:f10:b240::ffff/64 scope global noprefixroute

​       valid_lft forever preferred_lft forever

​    inet6 fe80::20c:29ff:fe36:1de2/64 scope link noprefixroute

​       valid_lft forever preferred_lft forever

[root@martlet121 ~]# <mark> cat /etc/NetworkManager/system-connections/ens160.nmconnection </mark>                #软路由自己的ipv4和ipv6网关指向网络内正确网关

[connection]

id=ens160

uuid=2ee1d081-64a1-316d-9865-97a96d65bb19

type=ethernet

autoconnect-priority=-999

interface-name=ens160

timestamp=1722186972

[ethernet]

[ipv4]

address1=192.168.1.254/24,192.168.1.1

dns=114.114.114.114;

method=manual

[ipv6]

method=manual

address1=2409:8a62:f10:b240::ffff/64

gateway=fe80::f221:78ff:feda:e104

dns=2001:4860:4860::8888;2001:4860:4860::8844;

never-default=false

ip6-privacy=0

[proxy]

[root@martlet121 ~]#





三、客户端

1、Windows

​    设置客户端的网关为软路由的网关，这样默认所有流量会优先发给软路由；想自动生效的话，就要改dhcp服务器中关于此网段的配置，设置自动分配地址时分配的网关为软路由网关即可

![文章配图](<./files/51 透明代理（TPROXY）/2.png>)



2、Linux

[root@martlet121171 ~]# <mark> cat /etc/NetworkManager/system-connections/ens160.nmconnection </mark>                  #ipv4和ipv6的网关地址都指向软路由

[connection]

id=ens160

uuid=77bd86c8-c18b-3e18-8811-a78d4c90e057

type=ethernet

autoconnect-priority=-999

interface-name=ens160

timestamp=1744218398

[ethernet]

[ipv4]

address1=192.168.1.171/24

dns=114.114.114.114;

gateway=192.168.1.254

method=manual

[ipv6]

method=manual

address1=2409:8a62:f10:b240::ac/64

gateway=2409:8a62:f10:b240::ffff

dns=2001:4860:4860::8888;2001:4860:4860::8844;

never-default=false

ip6-privacy=0

[proxy]

[root@martlet121171 ~]#


---
description: "当前配置DNS查询是使用的系统dns，国内dns可能解析不到部分域名"
---

   当前配置DNS查询是使用的系统dns，国内dns可能解析不到部分域名

​    只能代理tcp和udp流量，不能ping

​    每次重启iptables配置会掉

​    不能实现局域网内流量走国内和国外流量分流（当前没设置路由）

![文章配图](<./files/50 透明代理（REDIRECT）/1.png>)

[透明代理.vsdx](<./files/50 透明代理（REDIRECT）/透明代理.vsdx>)







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

[root@martlet121 ~]# <mark> systemctl restart v2ray </mark>                #修改配置后要重启生效

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

[root@martlet121 ~]# <mark> systemctl stop firewalld.service </mark>                    #停止防火墙

[root@martlet121 ~]# <mark> systemctl disable firewalld.service </mark>                    #关闭开机启动

Removed "/etc/systemd/system/multi-user.target.wants/firewalld.service".

Removed "/etc/systemd/system/dbus-org.fedoraproject.FirewallD1.service".

[root@martlet121 ~]# <mark> setenforce 0 </mark>                    #临时关闭selinux

[root@martlet121 ~]# <mark> sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/sysconfig/selinux </mark>                 #永久关闭SELinux

[root@martlet121 ~]# <mark> echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf </mark>                      #永久开启数据包转发功能

[root@martlet121 ~]# <mark> sysctl -p </mark>                   #立即生效

net.ipv4.ip_forward = 1

[root@martlet121 ~]# <mark> route -n </mark>                        #软路由默认所有流量指向真实路由器

Kernel IP routing table

Destination     Gateway         Genmask         Flags Metric Ref    Use Iface

0.0.0.0         192.168.1.1     0.0.0.0         UG    100    0        0 ens160

192.168.1.0     0.0.0.0         255.255.255.0   U     100    0        0 ens160

[root@martlet121 ~]#



2、v2ray客户端配置

[root@martlet121 ~]# <mark> bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh) </mark>                      #安装软件包，当前是下载成功了，如果脚本安不了，直接去下载离线包，解压安装即可

[root@martlet121 ~]# <mark> vim /usr/local/etc/v2ray/config.json </mark>                        #修改主配置文件

```json
{
  "inbounds": [
    {
      "port": 1080,                //本地监听端口，浏览器配置的代理端口
      "protocol": "socks",                 //入口协议为SOCKS 5
      "sniffing": {                     //流量探测，根据指定的流量类型，重置所请求的目标；识别域名后应用域名路由规则、解决dns污染、可识别BT协议再处理
        "enabled": true,
        "destOverride": ["http", "tls"]
      },
      "settings": {
        "auth": "noauth"                   //socks的认证设置，noauth代表不认证，由于socks通常在客户端使用，所以这里不认证
      }
        },
    {
      "port": 12345,                //接收局域网流量的端口号
      "protocol": "dokodemo-door",                //此协议是接收iptables传入的局域网流量
      "settings": {
        "network": "tcp,udp",
        "followRedirect": true               //这里要为true才能接受来自iptables的流量
      },
      "sniffing": {
        "enabled": true,
        "destOverride": ["http", "tls"]
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
          "streamSettings": {
        "sockopt": {
          "mark": 255               //SO_MARK，用于iptables规则识别，每个outbound都要配置成一样的值，若不为255时，此处和iptables同步修改
        }
      }
    }
  ]
}
```

[root@martlet121 ~]# <mark> systemctl restart v2ray </mark>                    #重启服务应用配置

[root@martlet121 ~]# <mark> systemctl enable v2ray </mark>                #加入开机启动

Created symlink /etc/systemd/system/multi-user.target.wants/v2ray.service → /etc/systemd/system/v2ray.service.

[root@martlet121 ~]# <mark> netstat -anpt </mark>                    #查看端口监听

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



3、iptables配置，重启会失效

[root@martlet121 ~]# #以下内容直接在Linux命令行中粘贴即可

```bash
iptables -t nat -N V2RAY                      #新建V2RAY规则链，对tcp流量进行透明代理
iptables -t nat -A V2RAY -d 192.168.0.0/16 -j RETURN                      #直连192.168.0.0/16
iptables -t nat -A V2RAY -p tcp -j RETURN -m mark --mark 0xff                         #直连SO_MARK为0xff的流量（0xff是255的16进制数），此规则目的是避免代理本机流量出现环路
iptables -t nat -A V2RAY -p tcp -j REDIRECT --to-ports 12345                     #其余流量转发到V2Ray的12345端口
iptables -t nat -A PREROUTING -p tcp -j V2RAY                        #对局域网应用透明代理规则
iptables -t nat -A OUTPUT -p tcp -j V2RAY                        #对本机进行透明代理
ip rule add fwmark 1 table 100                           #从这里开始对UDP流量进行透明代理
ip route add local 0.0.0.0/0 dev lo table 100
iptables -t mangle -N V2RAY_MASK
iptables -t mangle -A V2RAY_MASK -d 192.168.0.0/16 -j RETURN
iptables -t mangle -A V2RAY_MASK -p udp -j TPROXY --on-port 12345 --tproxy-mark 1
iptables -t mangle -A PREROUTING -p udp -j V2RAY_MASK
```

[root@martlet121 ~]# 





三、客户端

​    设置客户端的网关为软路由的网关，这样默认所有流量会优先发给软路由；想自动生效的话，就要改dhcp服务器中关于此网段的配置，设置自动分配地址时分配的网关为软路由网关即可

![文章配图](<./files/50 透明代理（REDIRECT）/2.png>)

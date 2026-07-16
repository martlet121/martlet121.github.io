---
description: "主程序命令；语法格式： v2ray [参数]"
---

   主程序命令；语法格式：<mark> v2ray [参数] </mark> 



| 参数                 | 作用                                                         |
| -------------------- | ------------------------------------------------------------ |
| -version             | 查看版本                                                     |
| -test 配置文件路径   | 测试配置文件格式是否正确                                     |
| -config 配置文件路径 | 指定配置文件启动；未指定时从工作目录或v2ray.location.asset环境变量中找 |
| -format              | 指定配置文件格式，json、pb和protobuf                         |







[root@martlet121 ~]# <mark>  /usr/local/bin/v2ray test -config /usr/local/etc/v2ray/config.json </mark>                   #检查配置文件是否有语法错误

V2Ray 5.16.1 (V2Fly, a community-driven edition of V2Ray.) Custom (go1.22.2 linux/amd64)

A unified platform for anti-censorship.

Configuration OK.

[root@martlet121 ~]#
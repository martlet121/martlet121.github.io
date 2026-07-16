---
description: "文件末尾的逗号，是大模块之间的分隔"
---

   文件末尾的逗号，是大模块之间的分隔



![文章配图](<./files/13 DNS/1.png>)







一、基础配置

​    打开客户端解压后路径config.json文件，编辑完成后运行v2ray.exe文件

```json
{
 "dns": {
   "servers": [
     "https://223.5.5.5/dns-query",
     "localhost"                       //使用系统的DNS配置解析ip，而不是V2ray直接跟DNS服务器通信，这个通信不受Routing等模块控制；默认不写DNS配置时，也是用的localhost，用系统本身DNS来解析
   ]
 },
}
```





二、DNS分流

​    打开客户端解压后路径config.json文件，编辑完成后运行v2ray.exe文件

```json
{
 "dns": {
   "servers": [
     {
       "address": "114.114.114.114",
       "port": 53,
       "domains": [
         "geosite:cn"                  //cn域名使用114查询
       ],
       "expectIPs": [
         "geoip:cn"                   //查询的结果应该是国内地址，如果不是国内地址则进行下一个dns的查询
       ]
     },
     {
       "address": "8.8.8.8",
       "port": 53,
       "domains": [
         "geosite:geolocation-!cn",                   //查询非cn域名，也就是国外域名，直接返回查询的IP结果
         "geosite:speedtest",
         "ext:h2y.dat:gfw"
       ]
     },
     "1.1.1.1",
     "localhost"                   //都未匹配时使用本地dns配置查询
   ]
 },
}
```





三、服务端配置

​    无需复杂配置，freedom的outbound在配置"domainStrategy"为"UseIP" | "UseIPv4" | "UseIPv6"的时候才会使用内置DNS，默认AsIs使用操作系统的DNS去解析和连接

​    只有在客户端、服务端都使用DOH 协议（客户端使用https模式，服务端使用https+local模式）时，VPS出口上才不会出现传统的UDP DNS请求；可隐藏查询内容且防止DNS污染



[root@martlet121 ~]# <mark> vim /usr/local/etc/v2ray/config.json </mark>                   #修改配置文件

```json
{
 "dns": {
   "servers": [
     "https+local://1.1.1.1/dns-query",                          //只在服务端使用DOHL服务地址（DNS over HTTPS），稳定的DOH提供商只有CloudFlare的1.1.1.1；客户端要使用的话只有阿里的https://223.5.5.5/dns-query，此时客户端会根据路由规则走
     "localhost"
   ]
 },
}
```

[root@martlet121 ~]# <mark> systemctl restart v2ray </mark>                   #重启服务
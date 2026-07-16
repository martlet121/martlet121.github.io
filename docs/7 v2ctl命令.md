---
description: "命令工具集合；语法格式： v2ctl [子命令] [参数]"
---

   命令工具集合；语法格式：<mark> v2ctl [子命令] [参数] </mark>







一、v2ctl api

​    调用V2Ray进程的远程控制指令；语法格式：<mark>  v2ctl api [--server=127.0.0.1:8080]  <Service.Method> < Requert > </mark>



[root@wuzuniao ~]# <mark> v2ctl api --server=127.0.0.1:8080 LoggerService.RestartLogger '' </mark>                       #远程执行指定命令





二、v2ctl config

​    从标准输入读取JSON格式的配置，然后从标准输出打印Protobuf格式的配置

​    没有参数





三、v2ctl cert

​    生成TLS证书；语法格式：<mark> v2ctl cert [--ca] [--domain=v2ray.com] [--expire=240h] [--name="V2Ray Inc"] [--org="V2Ray Inc] [--json] [--file=v2ray] </mark> 



| 参数     | 作用                                                         |
| -------- | ------------------------------------------------------------ |
| --ca     | 生成CA证书；默认生成TLS证书                                  |
| --domain | 证书Alternative Name项；可多次使用来指定多个域名             |
| --expire | 证书有效期                                                   |
| --name   | 证书Command Name项                                           |
| --org    | 证书Orgnization项                                            |
| --json   | 将生成的证书以V2Ray支持的JSON格式输出到标准输出；默认开启    |
| --file   | 将证书以PEM格式输出到文件；例：--file=a      表示生成a_cert.pem和a_key.pem两个文件 |





四、v2ctl fetch

​    抓取指定的URL内容并输出，只支持HTTP和HTTPS；语法格式：<mark> v2ctl fetch < url > </mark> 





五、v2ctl tlsping

​    向指定的域名发起TLS握手，V2Ray 4.17+开始支持；语法格式：<mark> v2ctl tlsping < domain >  --ip=[ip] </mark> 



| 参数   | 作用                              |
| ------ | --------------------------------- |
| domain | 目标域名                          |
| --ip   | 域名的IP，未指定时使用系统DNS解析 |





六、v2ctl verify

​    验证文件是否由Project V官方签名；语法格式：<mark> v2ctl verify [--sig=/path/to/sigfile] < filepath > </mark> 



| 参数     | 作用                                       |
| -------- | ------------------------------------------ |
| --sig    | 签名文件路径；默认为待验证文件加入.sig后缀 |
| filepath | 待验证文件路径                             |





七、v2ctl uuid

​    每次运行都会输出一个新的随机UUID

​    没有参数
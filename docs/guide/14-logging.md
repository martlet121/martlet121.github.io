   文件末尾的逗号，是大模块之间的分隔



| 配置项   | 作用                                                         |
| -------- | ------------------------------------------------------------ |
| loglevel | 日志级别；debug：最详细的日志信息；用于软件调试；info：比较详细的日志信息，可看到V2Ray详细的连接信息；warning：警告信息，轻微的问题，大多是网络错误，推荐此级别；error：错误信息，比较严重的错误信息，会影响V2Ray正常运行；none：空，不记录任何信息 |
| access   | 访问记录输出路径；""：输出至控制台即stdout；"none"：不输出任何信息；"/path/access.log"：输出到指定文件/path/access.log |
| error    | 错误记录输出路径；""：输出至控制台即stdout；"none"：不输出任何信息；"/path/error.log"：输出到指定文件/path/error.log |







一、客户端

​    打开客户端解压后路径config.json文件，编辑完成后运行v2ray.exe文件

```json
"log": {
    "loglevel": "info",                  //日志级别
    "access": "C:\\v2ray\\access.log",               //Windows系统路径
    "error": "C:\\v2ray\\error.log"
  },
```





二、服务端

[root@martlet121 ~]# <mark> vim /usr/local/etc/v2ray/config.json </mark>                  #修改配置文件

```json
"log": {
    "loglevel": "warning",
    "access": "/var/log/v2ray/access.log",               //Linux路径
    "error": "/var/log/v2ray/error.log"
  },
```

[root@martlet121 ~]# <mark> systemctl restart v2ray </mark>                    #重启服务

[root@martlet121 ~]# <mark> cat /var/log/v2ray/access.log </mark>                 #验证结果

2024/08/16 10:54:57 175.152.31.167:50695 accepted tcp:www.google.com:443

[root@martlet121 ~]# 


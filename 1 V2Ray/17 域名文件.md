一、内置的域名文件

​    geosite.dat和geoip.dat文件内置了很多常见的网站，是官方自带的，在压缩包目录中

```json
      {
        "type": "field",                    //type格式是固定的
        "outboundTag": "direct",                  //匹配下面规则后，流量转发到tag为direct的出口
        "domain": ["geosite:cn"]                    //中国大陆主流网站域名，geosite:表示geosite.dat文件，cn表示里面的cn规则
      },
```





二、外置的域名文件

​    第三方GUI客户端不支持自定义外置的域名文件

​    官方外置文件：https://github.com/ToutyRater/V2Ray-SiteDAT/tree/master/geofiles 下载h2y.dat文件

```json
"rules":[
    {
        "type": "field",
        "outboundTag": "block",           //拦截广告相关域名
        "domain": [
            "ext:h2y.dat:ad"               //ext表示使用外部文件；h2y.dat是具体的文件名；tag泛指标签，ad是常见的广告域名
        ]
    },
    {
        "type": "field",
        "outboundTag": "proxy",            //被gfw屏蔽的域名走代理
        "domain": [
            "ext:h2y.dat:gfw"               //ext表示使用外部文件；h2y.dat是具体的文件名；tag泛指标签，gfw是常见的被gfw屏蔽的域名
        ]
    },
    {
        "type": "field",
        "network":"tcp,udp",                //匹配剩余所有未匹配流量
        "outboundTag": "direct"             //让剩余流量走直连；如果不想默认流量走第一个出口代理的话，就在这里设置让走直连，也就是未匹配gfw规则的流量都走直连
    }
]
```


路由routing的domainStrategy几种模式

​    AsIs：当终端请求一个域名时，进行路由里面的domain进行匹配，不管是否能匹配，直接按路由规则走；速度最快，但不精准

​    IPIfNonMatch：当终端请求一个域名时，进行路由里面的domain进行匹配，若无法匹配到结果，则对这个域名进行DNS查询，用结果的IP地址再重新进行IP路由匹配

​    IPOnDemand：当匹配时碰到任何基于IP的规则，将域名立即解析为IP进行匹配；速度最慢，但精准



| 配置项            | 作用                                                         |
| ----------------- | ------------------------------------------------------------ |
| protocol          | freedom：直连，配置此项的出口直接访问目标网站；blackhole：黑洞，拒绝所有连接；vmess：v2ray代理协议；shadowsocks：代理协议 |
| domain:taobao.com | domain:表示所有子域名；*不是通配符的意思                     |
| geosite:cn        | geosite:表示geosite.dat文件，cn表示里面的cn规则              |







一、客户端配置

​    打开客户端解压后路径config.json文件，编辑完成后运行v2ray.exe文件

```json
{
"log": {
    "loglevel": "warning",                  //日志级别
    "access": "C:\\v2ray\\access.log",               //Windows系统路径
    "error": "C:\\v2ray\\error.log"
  },
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
      "protocol": "vmess",                  //出口协议,多出口场景，没有匹配到路由规则的项，默认都会走第一个出口
      "settings": {
        "vnext": [
          {
            "address": "45.76.177.113",                   //服务器地址，请修改为你自己的服务器 IP 或域名
            "port": 16823,                  //服务器端口
            "users": [
              {
                "id": "6603eb89-d26e-46b2-a626-49e18e074a6e",                      //用户ID，必须与服务器端配置相同；客户端使用此ID加密后再传给服务端
                "alterId": 0                  //此处的值也应当与服务器相同，v4.28.1版本之后必须设置为0以启用VMessAEAD
              }
            ]
          }
        ]
      }
    },
    {
      "protocol": "freedom",
      "settings": {},
      "tag": "direct"             //如果要使用路由，一定要有tag，相当于出口别名，路由规则中通过tag调用
    }    
  ],
  "routing": {
    "domainStrategy": "IPOnDemand",
    "rules": [
      {
        "type": "field",                      //type格式是固定的
        "outboundTag": "direct",                //匹配下面规则后，流量转发到tag为direct的出口
        "domain": ["geosite:cn"]                //中国大陆主流网站域名；domain和ip的匹配不能出现在一个规则子项里，要像本例中分开匹配才行，本例是or的关系，否则他们就是and的关系，and的场景不符合实际场景
      },
      {
        "type": "field",                    //type格式是固定的
        "outboundTag": "direct",                //匹配下面规则后，流量转发到tag为direct的出口
        "ip": [
          "geoip:cn",            //中国大陆IP
          "geoip:private"               //私有IP地址，路由器等
        ]
      }
    ]
  }
}
```





二、服务端配置

[root@martlet121 ~]# <mark> cat /usr/local/etc/v2ray/config.json </mark>                     #服务器端配置没有改变

```json
{

"log": {
    "loglevel": "warning",
    "access": "/var/log/v2ray/access.log",               //Linux路径
    "error": "/var/log/v2ray/error.log"
  },

  "inbounds": [
    {
      "port": 16823,           //服务器监听端口
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

[root@martlet121 ~]#
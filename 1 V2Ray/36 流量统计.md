   只能统计当前进程实例的数据，在服务器上统计就只统计服务器v2ray进程记录的数据，不涉及客户端；客户端上统计也识别不了服务器侧的设置

​    "stats", "api", "policy", "routing"这几个对象必须存在



​    流量统计分三类：inbound，user和outbound（4.26.0+）

​        inbound：inbound入站统计，需设置tag记录入站流量

​        user：vmess协议用户统计，用email进行统计和区分，其他协议内的用户不支持被统计

​        outbound：outbound出站统计，4.26.0版本新增，需设置tag记录入站流量







一、客户端配置（客户端没改）

​    打开客户端解压后路径config.json文件，编辑完成后运行v2ray.exe文件

```json
{
  "inbounds": [
    {
      "port": 1080,          //本地监听端口
      "protocol": "socks",            //入口协议为SOCKS 5
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
      "protocol": "vmess",            //出口协议
      "settings": {
        "vnext": [
          {
            "address": "45.76.177.113",             //服务器地址
            "port": 10000,                //服务器端口
            "users": [
              {
                "id": "6603eb89-d26e-46b2-a626-49e18e074a6e",             //用户ID，必须与服务器端配置相同
                "alterId": 0                //此处的值也应当与服务器相同
              }
            ]
          }
        ]
      }
    }
  ]
}
```





二、服务器配置

[root@martlet121 ~]# <mark> vim /usr/local/etc/v2ray/config.json </mark>                     #修改服务器侧配置文件

```json
{
  "stats": {},
  "api": {
    "tag": "api",
    "services": [
      "StatsService"              //通过api查询流量需开启
    ]
  },
  "policy": {               //统计开关
    "levels": {             //用户统计开关
      "0": {
        "statsUserUplink": true,
        "statsUserDownlink": true
      }
    },
    "system": {               //全局统计开关，in和out方向
      "statsInboundUplink": true,
      "statsInboundDownlink": true,
      "statsOutboundUplink": true,
      "statsOutboundDownlink": true
    }
  },
  "inbounds": [
    {
      "tag": "tcp",                //全局统计必须在入站和出站位置设置tag
      "port": 10000,
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "email": "userA",             //用户统计必须设置email来标识不同用户
            "id": "6603eb89-d26e-46b2-a626-49e18e074a6e",
            "level": 0,
            "alterId": 0
          },
          {
            "email": "userB",             //用户统计必须设置email来标识不同用户
            "id": "e731f153-4f31-49d3-9e8f-ff8f396135ee",
            "level": 0,
            "alterId": 0
          }
        ]
      }
    },
    {
      "listen": "127.0.0.1",
      "port": 10001,
      "protocol": "dokodemo-door",               //必须为此协议
      "settings": {
        "address": "127.0.0.1"
      },
      "tag": "api"               //要通过api查询流量，额外的入站必须设置成当前配置这样
    }
  ],
  "outbounds": [
    {
      "tag": "direct",
      "protocol": "freedom",
      "settings": {}
    }
  ],
  "routing": {
    "rules": [
      {
        "inboundTag": [
          "api"
        ],
        "outboundTag": "api",                 //要通过api查询流量，必须有inboundTag:api -> outboundTag:api规则
        "type": "field"
      }
    ],
    "domainStrategy": "AsIs"
  }
}
```

[root@martlet121 ~]# <mark> systemctl restart v2ray </mark>                   #重启服务应用配置

[root@martlet121 ~]# <mark> netstat -an | grep 1000 </mark>                      #查看监听的端口

tcp        0      0 127.0.0.1:10001         0.0.0.0:*               LISTEN

tcp6       0      0 :::10000                :::*                    LISTEN

[root@martlet121 ~]#



1、命令查询

[root@martlet121 ~]# <mark> wget https://github.com/v2fly/v2ray-core/releases/download/v4.31.0/v2ray-linux-64.zip </mark>                  #下载v2ray主程序

[root@martlet121 ~]# <mark> unzip v2ray-linux-64.zip </mark>                  #解压软件包

[root@martlet121 ~]# <mark> cp v2ctl /usr/local/bin/ </mark>                    #拷贝命令行工具到bin目录

[root@martlet121 ~]# <mark> v2ctl api --server=127.0.0.1:10001 StatsService.QueryStats 'pattern: "" reset: false' </mark>                   #QueryStats表示查询匹配的记录； pattern留空表示匹配所有记录；reset可让匹配的单元数值置零，false表示不置零

stat: <

  name: "user>>>userA>>>traffic>>>uplink"

  value: 630305                 #value的单位为字节

\>

stat: <

  name: "user>>>userA>>>traffic>>>downlink"

  value: 240735949

\>

stat: <

  name: "inbound>>>tcp>>>traffic>>>uplink"

  value: 810376

\>

stat: <

  name: "inbound>>>tcp>>>traffic>>>downlink"

  value: 249825740

\>

stat: <

  name: "inbound>>>api>>>traffic>>>uplink"

  value: 174

\>

stat: <

  name: "inbound>>>api>>>traffic>>>downlink"

  value: 24

\>

stat: <

  name: "outbound>>>direct>>>traffic>>>uplink"

  value: 626434

\>

stat: <

  name: "outbound>>>direct>>>traffic>>>downlink"

  value: 240735949

\>

[root@martlet121 ~]# <mark> v2ctl api --server=127.0.0.1:10001 StatsService.GetStats 'name: "user>>>userA>>>traffic>>>downlink" reset: false' </mark>                       #GetStats查询单个记录；name指定查询哪个记录；reset可让匹配的单元数值置零，false表示不置零

stat: <

  name: "user>>>userA>>>traffic>>>downlink"

  value: 252285618

\>

[root@martlet121 ~]#



2、脚本查询

​    前提是v2ctl命令在系统中必须有

[root@martlet121 ~]# <mark> vim traffic.sh </mark>                    #创建脚本文件

```bash
#!/bin/bash

_APISERVER=127.0.0.1:10001                       #端口注意替换为自己设置的
_V2CTL=/usr/local/bin/v2ctl

apidata () {
    local ARGS=
    if [[ $1 == "reset" ]]; then
      ARGS="reset: true"
    fi
    $_V2CTL api --server=$_APISERVER StatsService.QueryStats "${ARGS}" \
    | awk '{
        if (match($1, /name:/)) {
            f=1; gsub(/^"|link"$/, "", $2);
            split($2, p,  ">>>");
            printf "%s:%s->%s\t", p[1],p[2],p[4];
        }
        else if (match($1, /value:/) && f){ f = 0; printf "%.0f\n", $2; }
        else if (match($0, /^>$/) && f) { f = 0; print 0; }
    }'
}

print_sum() {
    local DATA="$1"
    local PREFIX="$2"
    local SORTED=$(echo "$DATA" | grep "^${PREFIX}" | sort -r)
    local SUM=$(echo "$SORTED" | awk '
        /->up/{us+=$2}
        /->down/{ds+=$2}
        END{
            printf "SUM->up:\t%.0f\nSUM->down:\t%.0f\nSUM->TOTAL:\t%.0f\n", us, ds, us+ds;
        }')
    echo -e "${SORTED}\n${SUM}" \
    | numfmt --field=2 --suffix=B --to=iec \
    | column -t
}

DATA=$(apidata $1)
echo "------------Inbound----------"
print_sum "$DATA" "inbound"
echo "-----------------------------"
echo "------------Outbound----------"
print_sum "$DATA" "outbound"
echo "-----------------------------"
echo
echo "-------------User------------"
print_sum "$DATA" "user"
echo "-----------------------------"
```

[root@martlet121 ~]# <mark> bash traffic.sh </mark>                    #执行脚本查看输出结果

------------Inbound----------

inbound:tcp->up    834KB

inbound:tcp->down  279MB

inbound:api->up    649B

inbound:api->down  665B

SUM->up:           834KB

SUM->down:         279MB

SUM->TOTAL:        280MB

\-----------------------------

------------Outbound----------

outbound:direct->up    645KB

outbound:direct->down  269MB

SUM->up:               645KB

SUM->down:             269MB

SUM->TOTAL:            270MB

\-----------------------------

-------------User------------

user:userA->up    649KB

user:userA->down  269MB

SUM->up:          649KB

SUM->down:        269MB

SUM->TOTAL:       270MB

\-----------------------------

[root@martlet121 ~]#



3、查看每秒的流量

[root@martlet121 ~]# <mark> chmod 777 traffic.sh </mark>                  #授予执行权限

[root@martlet121 ~]# <mark> watch -n 1 ./traffic.sh reset </mark>               # reset参数可置零统计信息；watch命令指定每秒运行脚本，不指定则默认为2s刷新

Every 1.0s: ./traffic.sh reset                           martlet121: Mon Aug 19 15:45:37 2024

------------Inbound----------

inbound:tcp->up    257B

inbound:tcp->down  394KB

inbound:api->up    176B

inbound:api->down  432B

SUM->up:           433B

SUM->down:         394KB

SUM->TOTAL:        394KB

\-----------------------------

------------Outbound----------

outbound:direct->up    215B

outbound:direct->down  380KB

SUM->up:               215B

SUM->down:             380KB

SUM->TOTAL:            380KB

\-----------------------------

-------------User------------

user:userA->up    215B

user:userA->down  380KB

SUM->up:          215B

SUM->down:        380KB

SUM->TOTAL:       380KB

\-----------------------------


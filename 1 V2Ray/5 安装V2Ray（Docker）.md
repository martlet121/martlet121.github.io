   Docker只能部署在KVM或XEN架构的云服务器中

​    官方镜像：https://hub.docker.com/r/v2fly/v2fly-core







[root@martlet121 ~]# <mark> mkdir -p /etc/v2ray </mark>                    #创建放置配置文件的目录

[root@martlet121 ~]# <mark> vim /etc/v2ray/config.json </mark>                      #创建主配置文件；此为服务端配置

```json
{
  "inbounds": [
    {
      "port": 10000,           //服务器监听端口
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

[root@martlet121 ~]# <mark> yum -y install docker </mark>                        #安装docker

[root@martlet121 ~]# <mark> podman pull docker.io/v2fly/v2fly-core:latest </mark>                       #拉取v2fly镜像

Trying to pull docker.io/v2fly/v2fly-core:latest...

Getting image source signatures

Copying blob cadf74b5ecfe done   |

Copying blob d25f557d7f31 done   |

Copying blob 4f4fb700ef54 done   |

Copying blob 2820c8f15591 done   |

Copying config d1c717b3cc done   |

Writing manifest to image destination

d1c717b3cc8c7602fdb89a886d0c7fc0cf8c1d973501101d5f5e86f1ec6dcccf

[root@martlet121 ~]# <mark> docker run -d --name v2ray -e TZ=Asia/Shanghai -v /etc/v2ray:/etc/v2ray -p 10000:10000 --restart always v2fly/v2fly-core run -c /etc/v2ray/config.json </mark>                            #指定容器名v2ray进行部署，设置所在时区、容器内10000端口映射到物理主机上10000端口，指定配置文件路径

Emulate Docker CLI using podman. Create /etc/containers/nodocker to quiet msg.

743a3f766c6af1eeb553ffbf6e402ddd2de3c7cba1080aba924b057e76ac24f1

[root@martlet121 ~]# <mark> docker container ls </mark>                        #查看容器运行状态

Emulate Docker CLI using podman. Create /etc/containers/nodocker to quiet msg.

CONTAINER ID  IMAGE                              COMMAND               CREATED         STATUS         PORTS                     NAMES

743a3f766c6a  docker.io/v2fly/v2fly-core:latest  run -c /etc/v2ray...  23 seconds ago  Up 22 seconds  0.0.0.0:10000->10000/tcp  v2ray

[root@martlet121 ~]# <mark> docker container start v2ray </mark>                     #启动容器

Emulate Docker CLI using podman. Create /etc/containers/nodocker to quiet msg.

v2ray

[root@martlet121 ~]# <mark> docker container restart v2ray </mark>                    #重启容器

Emulate Docker CLI using podman. Create /etc/containers/nodocker to quiet msg.

v2ray

[root@martlet121 ~]# <mark> docker container stop v2ray </mark>                     #停止容器

Emulate Docker CLI using podman. Create /etc/containers/nodocker to quiet msg.

v2ray

[root@martlet121 ~]# <mark> docker container rm v2ray </mark>                     #删除容器；运行状态的容器不能删除，必须先停止；配置有更新都是删了后重新部署

Emulate Docker CLI using podman. Create /etc/containers/nodocker to quiet msg.

v2ray

[root@martlet121 ~]# <mark> docker container logs v2ray </mark>                     #查看容器日志

Emulate Docker CLI using podman. Create /etc/containers/nodocker to quiet msg.

V2Ray 5.16.1 (V2Fly, a community-driven edition of V2Ray.) Custom (go1.22.2 linux/amd64)

A unified platform for anti-censorship.

2024/08/24 06:56:16 [Warning] V2Ray 5.16.1 started

V2Ray 5.16.1 (V2Fly, a community-driven edition of V2Ray.) Custom (go1.22.2 linux/amd64)

A unified platform for anti-censorship.

2024/08/24 06:57:24 [Warning] V2Ray 5.16.1 started

V2Ray 5.16.1 (V2Fly, a community-driven edition of V2Ray.) Custom (go1.22.2 linux/amd64)

A unified platform for anti-censorship.

2024/08/24 06:57:37 [Warning] V2Ray 5.16.1 started

[root@martlet121 ~]#
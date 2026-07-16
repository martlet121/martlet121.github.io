---
description: "v2ray-windows-64.zip"
---

| 文件名          | 作用                                                         |
| --------------- | ------------------------------------------------------------ |
| v2ray.exe       | 运行V2Ray的前台程序文件                                      |
| wv2ray.exe      | 同v2ray.exe，但wv2ray.exe是后台程序，不会有前台窗口运行V2Ray时从v2ray.exe和wv2ray.exe中任选一个即可 |
| config.json     | 配置文件                                                     |
| v2ctl.exe       | V2Ray的工具，有多种功能，除特殊用途外，一般由v2ray.exe来调用，用户不用太关心 |
| geosite.dat     | 用于路由的域名文件                                           |
| geoip.dat       | 用于路由的IP文件                                             |
| ./doc/readme.md | 软件详细说明                                                 |

![v2ray-windows-64.zip](<./files/3 安装V2Ray（Windows）/1.png>)

[v2ray-windows-64.zip](<./files/3 安装V2Ray（Windows）/v2ray-windows-64.zip>)

[v2ray-extra.zip](<./files/3 安装V2Ray（Windows）/v2ray-extra.zip>)

V2Ray v4.45.2，v5版本后会直接闪退







一、参考5 VMess配置完<mark> config.json </mark> 文件



二、双击运行v2ray.exe



三、浏览器设置代理

​    V2Ray不会自动设置系统代理，需要在浏览器里设置代理；以火狐（Firefox）为例

​    点菜单 -> 设置

![文章配图](<./files/3 安装V2Ray（Windows）/2.png>)

​    常规 -> 网络设置 -> 设置

![文章配图](<./files/3 安装V2Ray（Windows）/3.png>)

​    手动配置代理，在SOCKS Host填上<mark> 127.0.0.1 </mark> ，后面的Port填<mark> 1080 </mark> ，再勾上 使用<mark> SOCKS v5时代理DNS查询</mark> 

![文章配图](<./files/3 安装V2Ray（Windows）/4.png>)


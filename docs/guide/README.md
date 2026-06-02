---
home: false
title: 配置指南
---

# V2Ray 配置指南

欢迎来到 V2Ray 配置指南！本指南提供了详细的配置教程和实用案例。

## 📚 指南内容

### 🎯 第一部分：介绍和安装
- [介绍V2Ray](./1-intro.md) - 了解 V2Ray 的基本概念
- [Linux 安装](./2-linux.md) - 在 Linux 系统上安装 V2Ray
- [Windows 安装](./3-windows.md) - 在 Windows 系统上安装 V2Ray
- [安卓安装](./4-android.md) - 在安卓设备上安装 V2Ray
- [Docker 安装](./5-docker.md) - 使用 Docker 部署 V2Ray
- [v2ray 命令](./6-commands.md) - V2Ray 命令行工具使用
- [v2ctl 命令](./7-ctl-commands.md) - V2Ray 控制工具使用

### ⚙️ 第二部分：基础配置
- [配置格式](./10-config-format.md) - 理解配置文件结构
- [VMess 协议](./11-vmess.md) - V2Ray 原生协议配置
- [Shadowsocks 协议](./12-shadowsocks.md) - SS 协议配置
- [DNS 配置](./13-dns.md) - DNS 解析和分流
- [日志设置](./14-logging.md) - 日志配置和调试
- [国内路由直连](./15-domestic-routing.md) - 国内流量直连配置
- [网站过滤](./16-site-filtering.md) - 按网站分流配置
- [域名文件](./17-domain-files.md) - 使用域名列表文件
- [禁用 BT](./18-disable-bt.md) - 禁用 BT 流量

### 🔐 第三部分：TLS 和传输
- [TLS 加密](./20-tls.md) - TLS 加密配置
- [TCP + TLS + Web](./21-tcp-tls-web.md) - TCP 传输+TLS+伪装网站
- [TCP + TLS 分流器（TCP）](./22-tcp-tls-diverter-tcp.md) - TCP 分流器配置
- [TCP + TLS 分流器（Socket）](./23-tcp-tls-diverter-socket.md) - Socket 分流器配置
- [WebSocket 传输](./25-websocket.md) - WebSocket 基础配置
- [WebSocket + TLS + Web](./26-websocket-tls-web.md) - WebSocket + TLS + 伪装
- [WebSocket + BrowserForwarder](./27-websocket-browser-forwarder.md) - WebSocket 浏览器转发

### 🚀 第四部分：高级协议
- [Mux 多路复用](./30-mux.md) - 连接复用
- [mKCP 协议](./31-mkcp.md) - KCP 协议实现
- [动态端口](./32-dynamic-port.md) - 动态改变通信端口
- [动态端口 + mKCP](./33-dynamic-port-mkcp.md) - 动态端口结合 mKCP
- [QUIC 协议](./34-quic.md) - QUIC 传输协议
- [TOR 网络](./35-tor.md) - 集成 TOR 网络
- [流量统计](./36-traffic-stats.md) - 流量监测和统计

### 🔧 第五部分：高级功能
- [HTTP/2](./40-http2.md) - HTTP/2 协议支持
- [前置代理](./41-forward-proxy.md) - 配置前置代理
- [透明代理（REDIRECT）](./50-transparent-redirect.md) - REDIRECT 方式透明代理
- [透明代理（TPROXY）](./51-transparent-tproxy.md) - TPROXY 方式透明代理
- [反向代理（端口映射）](./52-reverse-proxy-port-mapping.md) - 端口映射
- [反向代理（IP 穿透）](./53-reverse-proxy-ip-penetration.md) - IP 穿透配置
- [运行多个服务端进程](./54-multiple-server-processes.md) - 多进程部署
- [负载均衡（balancers）](./55-load-balancing-balancers.md) - 使用 balancers 实现负载均衡
- [负载均衡（vnext）](./56-load-balancing-vnext.md) - 使用 vnext 实现负载均衡

## 💡 使用建议

1. **新手入门**：建议按照顺序从"介绍和安装"开始阅读
2. **快速查找**：使用顶部搜索框快速定位特定功能
3. **深入学习**：逐步从基础配置学习到高级功能
4. **实践操作**：边学边配置，在实践中加深理解

---

**需要帮助？** 查看 [V2Ray 官方项目](https://github.com/v2ray/v2ray-core) 或 [V2Ray 社区](https://t.me/projectv2ray)

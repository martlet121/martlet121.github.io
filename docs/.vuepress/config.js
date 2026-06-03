module.exports = {
  lang: 'zh-CN',
  title: 'V2Ray 配置指南',
  description: 'V2Ray 配置指南 - 详细的配置教程和案例',
  base: '/',
  
  themeConfig: {
    logo: '/logo.png',
    repo: 'martlet121/martlet121.github.io',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: '编辑此页',
    lastUpdated: '最后更新时间',
    
    nav: [
      {
        text: '首页',
        link: '/',
      },
      {
        text: '配置指南',
        link: '/guide/',
      },
      {
        text: 'GitHub',
        link: 'https://github.com/martlet121/martlet121.github.io',
      },
    ],
    
    sidebar: {
      '/guide/': [
        {
          title: "介绍和安装",
          collapsible: true,
          children: [
            ["/guide/1-intro.md", "1 介绍V2Ray"],
            ["/guide/2-linux.md", "2 安装V2Ray（Linux）"],
            ["/guide/3-windows.md", "3 安装V2Ray（Windows）"],
            ["/guide/4-android.md", "4 安装V2Ray（安卓）"],
            ["/guide/5-docker.md", "5 安装V2Ray（Docker）"],
            ["/guide/6-commands.md", "6 v2ray命令"],
            ["/guide/7-ctl-commands.md", "7 v2ctl命令"]
          ],
        },
        {
          title: "基础配置",
          collapsible: true,
          children: [
            ["/guide/10-config-format.md", "10 配置格式"],
            ["/guide/11-vmess.md", "11 VMess"],
            ["/guide/12-shadowsocks.md", "12 Shadowsocks"],
            ["/guide/13-dns.md", "13 DNS"],
            ["/guide/14-logging.md", "14 日志"],
            ["/guide/15-domestic-routing.md", "15 国内路由直连"],
            ["/guide/16-site-filtering.md", "16 网站过滤"],
            ["/guide/17-domain-files.md", "17 域名文件"],
            ["/guide/18-disable-bt.md", "18 禁用BT"]
          ],
        },
        {
          title: "TLS 和传输",
          collapsible: true,
          children: [
            ["/guide/20-tls.md", "20 TLS"],
            ["/guide/21-tcp-tls-web.md", "21 TCP + TLS + Web"],
            ["/guide/22-tcp-tls-diverter-tcp.md", "22 TCP + TLS分流器（TCP）"],
            ["/guide/23-tcp-tls-diverter-socket.md", "23 TCP + TLS分流器（Socket）"],
            ["/guide/25-websocket.md", "25 WebSocket"],
            ["/guide/26-websocket-tls-web.md", "26 WebSocket + TLS + Web"],
            ["/guide/27-websocket-browser-forwarder.md", "27 WebSocket + BrowserForwarder"]
          ],
        },
        {
          title: "高级协议",
          collapsible: true,
          children: [
            ["/guide/30-mux.md", "30 Mux"],
            ["/guide/31-mkcp.md", "31 mKCP"],
            ["/guide/32-dynamic-port.md", "32 动态端口"],
            ["/guide/33-dynamic-port-mkcp.md", "33 动态端口 + mKCP"],
            ["/guide/34-quic.md", "34 QUIC"],
            ["/guide/35-tor.md", "35 TOR"],
            ["/guide/36-traffic-stats.md", "36 流量统计"],
            ["/guide/40-http2.md", "40 HTTP2"],
            ["/guide/41-forward-proxy.md", "41 前置代理"]
          ],
        },
        {
          title: "高级功能",
          collapsible: true,
          children: [
            ["/guide/50-transparent-redirect.md", "50 透明代理（REDIRECT）"],
            ["/guide/51-transparent-tproxy.md", "51 透明代理（TPROXY）"],
            ["/guide/52-reverse-proxy-port-mapping.md", "52 反向代理（端口映射）"],
            ["/guide/53-reverse-proxy-ip-penetration.md", "53 反向代理（ip穿透）"],
            ["/guide/54-multiple-server-processes.md", "54 运行多个服务端进程"],
            ["/guide/55-load-balancing-balancers.md", "55 负载均衡（balancers）"],
            ["/guide/56-load-balancing-vnext.md", "56 负载均衡（vnext）"]
          ],
        }
      ],
    },
  },
  
  plugins: [
    '@vuepress/plugin-search',
  ],
}

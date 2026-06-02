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
          title: '介绍和安装',
          collapsible: true,
          children: [
            '/guide/1-intro.md',
            '/guide/2-linux.md',
            '/guide/3-windows.md',
            '/guide/4-android.md',
            '/guide/5-docker.md',
            '/guide/6-commands.md',
            '/guide/7-ctl-commands.md',
          ],
        },
        {
          title: '基础配置',
          collapsible: true,
          children: [
            '/guide/10-config-format.md',
            '/guide/11-vmess.md',
            '/guide/12-shadowsocks.md',
            '/guide/13-dns.md',
            '/guide/14-logging.md',
            '/guide/15-domestic-routing.md',
            '/guide/16-site-filtering.md',
            '/guide/17-domain-files.md',
            '/guide/18-disable-bt.md',
          ],
        },
        {
          title: 'TLS 和传输',
          collapsible: true,
          children: [
            '/guide/20-tls.md',
            '/guide/21-tcp-tls-web.md',
            '/guide/22-tcp-tls-diverter-tcp.md',
            '/guide/23-tcp-tls-diverter-socket.md',
            '/guide/25-websocket.md',
            '/guide/26-websocket-tls-web.md',
            '/guide/27-websocket-browser-forwarder.md',
          ],
        },
        {
          title: '高级协议',
          collapsible: true,
          children: [
            '/guide/30-mux.md',
            '/guide/31-mkcp.md',
            '/guide/32-dynamic-port.md',
            '/guide/33-dynamic-port-mkcp.md',
            '/guide/34-quic.md',
            '/guide/35-tor.md',
            '/guide/36-traffic-stats.md',
          ],
        },
        {
          title: '高级功能',
          collapsible: true,
          children: [
            '/guide/40-http2.md',
            '/guide/41-forward-proxy.md',
            '/guide/50-transparent-redirect.md',
            '/guide/51-transparent-tproxy.md',
            '/guide/52-reverse-proxy-port-mapping.md',
            '/guide/53-reverse-proxy-ip-penetration.md',
            '/guide/54-multiple-server-processes.md',
            '/guide/55-load-balancing-balancers.md',
            '/guide/56-load-balancing-vnext.md',
          ],
        },
      ],
    },
  },
  
  plugins: [
    '@vuepress/plugin-search',
  ],
}

   V2Ray的验证包含时间，服务端和客户端时间相差必须在90s内；时区会自动转换，时间必须一致



Linux64位安装包：

   [v2ray-linux-64.zip](<./files/2 安装V2Ray（Linux）/v2ray-linux-64.zip>)

   [v2ray-linux-64.zip.dgst](<./files/2 安装V2Ray（Linux）/v2ray-linux-64.zip.dgst>)

安装脚本：

   [install-release.sh](<./files/2 安装V2Ray（Linux）/install-release.sh>)

源码：

​    [v2ray-core-4.45.2.tar.gz](<./files/2 安装V2Ray（Linux）/v2ray-core-4.45.2.tar.gz>)







一、基本配置

​    要关闭防火墙，iptables有规则的话也要清空

[root@martlet121 ~]# <mark> systemctl stop firewalld.service </mark>               #关闭防火墙

[root@martlet121 ~]# <mark> systemctl disable firewalld.service </mark>                #禁止开机启动

Removed symlink /etc/systemd/system/multi-user.target.wants/firewalld.service.

Removed symlink /etc/systemd/system/dbus-org.fedoraproject.FirewallD1.service.

[root@martlet121 ~]# <mark> setenforce 0 </mark>                    #关闭SELinux

[root@martlet121 ~]# <mark> sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/sysconfig/selinux </mark>                 #直接替换原文件内容中模式为关闭





二、脚本安装

[root@martlet121 ~]# <mark> date </mark>                 #查看时间；因为客户端是UTC+8的时区，显示时间是22点，所以是匹配的

Sat May 18 14:11:19 UTC 2024

[root@martlet121 ~]# <mark> bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh) </mark>                  #安装或更新V2Ray；对脚本使用-h参数可查看帮助

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current

​                                 Dload  Upload   Total   Spent    Left  Speed

100 22454  100 22454    0     0  52828      0 --:--:-- --:--:-- --:--:-- 52957

info: Installing V2Ray v5.16.1 for x86_64

Downloading V2Ray archive: https://github.com/v2fly/v2ray-core/releases/download/v5.16.1/v2ray-linux-64.zip

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current

​                                 Dload  Upload   Total   Spent    Left  Speed

  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0

100 14.2M  100 14.2M    0     0  5408k      0  0:00:02  0:00:02 --:--:-- 12.0M

Downloading verification file for V2Ray archive: https://github.com/v2fly/v2ray-core/releases/download/v5.16.1/v2ray-linux-64.zip.dgst

info: Extract the V2Ray package to /tmp/tmp.IPeVLxcRwQ and prepare it for installation.

info: Systemd service files have been installed successfully!

warning: The following are the actual parameters for the v2ray service startup.

warning: Please make sure the configuration file path is correctly set.

\~~~~~~~~~~~~~~~~

[Unit]

Description=V2Ray Service

Documentation=https://www.v2fly.org/

After=network.target nss-lookup.target

[Service]

User=nobody

CapabilityBoundingSet=CAP_NET_ADMIN CAP_NET_BIND_SERVICE

AmbientCapabilities=CAP_NET_ADMIN CAP_NET_BIND_SERVICE

NoNewPrivileges=true

ExecStart=/usr/local/bin/v2ray run -config /usr/local/etc/v2ray/config.json

Restart=on-failure

RestartPreventExitStatus=23

[Install]

WantedBy=multi-user.target

\# In case you have a good reason to do so, duplicate this file in the same directory and make your customizes there.

\# Or all changes you made will be lost!  # Refer: https://www.freedesktop.org/software/systemd/man/systemd.unit.html

[Service]

ExecStart=

ExecStart=/usr/local/bin/v2ray run -config /usr/local/etc/v2ray/config.json

\~~~~~~~~~~~~~~~~

warning: The systemd version on the current operating system is too low.

warning: Please consider to upgrade the systemd or the operating system.

installed: /usr/local/bin/v2ray

installed: /usr/local/share/v2ray/geoip.dat

installed: /usr/local/share/v2ray/geosite.dat

installed: /usr/local/etc/v2ray/config.json

installed: /var/log/v2ray/

installed: /var/log/v2ray/access.log

installed: /var/log/v2ray/error.log

installed: /etc/systemd/system/v2ray.service

installed: /etc/systemd/system/v2ray@.service

removed: /tmp/tmp.IPeVLxcRwQ

info: V2Ray v5.16.1 is installed.

You may need to execute a command to remove dependent software: yum remove curl unzip

Please execute the command: systemctl enable v2ray; systemctl start v2ray

[root@martlet121 ~]# <mark> systemctl start v2ray </mark>              #启动v2ray

[root@martlet121 ~]# <mark> systemctl enable v2ray </mark>              #加入开机自启动

Created symlink from /etc/systemd/system/multi-user.target.wants/v2ray.service to /etc/systemd/system/v2ray.service.

[root@martlet121 ~]# <mark> systemctl status v2ray </mark>                   #查看运行状态

● v2ray.service - V2Ray Service

   Loaded: loaded (/etc/systemd/system/v2ray.service; enabled; vendor preset: disabled)

  Drop-In: /etc/systemd/system/v2ray.service.d

​           └─10-donot_touch_single_conf.conf

   Active: active (running) since Sat 2024-05-18 14:23:28 UTC; 13min ago

​     Docs: https://www.v2fly.org/

 Main PID: 1806 (v2ray)

   CGroup: /system.slice/v2ray.service

​           └─1806 /usr/local/bin/v2ray run -config /usr/local/etc/v2ray/confi...

May 18 14:23:28 martlet121 systemd[1]: Started V2Ray Service.

May 18 14:23:29 martlet121 v2ray[1806]: V2Ray 5.16.1 (V2Fly, a community-driv...4)

May 18 14:23:29 martlet121 v2ray[1806]: A unified platform for anti-censorship.

May 18 14:23:29 martlet121 v2ray[1806]: 2024/05/18 14:23:29 [Warning] V2Ray 5...ed

Hint: Some lines were ellipsized, use -l to show in full.

[root@martlet121 ~]#





三、脚本+本地文件安装，适合无法访问外网下载安装包的方式

[root@martlet121 ~]# <mark> ll </mark>              #将从仓库下载的安装包及脚本上传到本地

-rw-r--r--. 1 root root    22454  8月 22 22:43 install-release.sh

-rw-r--r--. 1 root root 12486240  8月 22 22:43 v2ray-linux-64.zip

[root@martlet121 ~]# <mark> bash install-release.sh --local v2ray-linux-64.zip </mark>                   #指定本地文件进行安装

warn: Install V2Ray from a local file, but still need to make sure the network is available.

warn: Please make sure the file is valid because we cannot confirm it. (Press any key) ...

info: Extract the V2Ray package to /tmp/tmp.z3A9iDkE42 and prepare it for installation.

info: Systemd service files have been installed successfully!

warning: The following are the actual parameters for the v2ray service startup.

warning: Please make sure the configuration file path is correctly set.

\~~~~~~~~~~~~~~~~

[Unit]

Description=V2Ray Service

Documentation=https://www.v2fly.org/

After=network.target nss-lookup.target

[Service]

User=nobody

CapabilityBoundingSet=CAP_NET_ADMIN CAP_NET_BIND_SERVICE

AmbientCapabilities=CAP_NET_ADMIN CAP_NET_BIND_SERVICE

NoNewPrivileges=true

ExecStart=/usr/local/bin/v2ray -config /usr/local/etc/v2ray/config.json

Restart=on-failure

RestartPreventExitStatus=23

[Install]

WantedBy=multi-user.target

\# In case you have a good reason to do so, duplicate this file in the same directory and make your customizes there.

\# Or all changes you made will be lost!  # Refer: https://www.freedesktop.org/software/systemd/man/systemd.unit.html

[Service]

ExecStart=

ExecStart=/usr/local/bin/v2ray -config /usr/local/etc/v2ray/config.json

\~~~~~~~~~~~~~~~~

warning: The systemd version on the current operating system is too low.

warning: Please consider to upgrade the systemd or the operating system.

installed: /usr/local/bin/v2ray

installed: /usr/local/bin/v2ctl

installed: /usr/local/share/v2ray/geoip.dat

installed: /usr/local/share/v2ray/geosite.dat

installed: /etc/systemd/system/v2ray.service

installed: /etc/systemd/system/v2ray@.service

removed: /tmp/tmp.z3A9iDkE42

info: V2Ray v4.45.2 is installed.

You may need to execute a command to remove dependent software: yum remove curl unzip

Please execute the command: systemctl enable v2ray; systemctl start v2ray

[root@martlet121 ~]# <mark> systemctl start v2ray </mark>               #启动v2ray

[root@martlet121 ~]# <mark> systemctl enable v2ray </mark>              #加入开机自启动

Created symlink from /etc/systemd/system/multi-user.target.wants/v2ray.service to /etc/systemd/system/v2ray.service.

[root@martlet121 ~]#
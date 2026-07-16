---
description: "v1.19版本开始支持TLS（传输层安全）"
---

   v1.19版本开始支持TLS（传输层安全）



​    生成证书需要有个域名，使用证书认证机构Let's Encrypt可生成3个月的免费证书

​    生成证书项目地址：https://github.com/Neilpang/acme.sh

​    帮助文档：https://github.com/Neilpang/acme.sh/wiki/Options-and-Params

[acme.sh-master.zip](<./files/20 TLS/acme.sh-master.zip>)



​    ECC 证书（内置公钥是 ECDSA 公钥）：同等长度ECC比RSA更安全，但Android 4.x以下和Windows XP不支持，建议使用此种方式

​    RSA 证书（内置 RSA 公钥）：在安全性上256位的ECC证书等同于3072位的RSA证书







一、申请证书

​    前提是有自己的证书，并添加解析到服务器，已提前设置好

[root@martlet121 ~]# <mark> dnf -y install openssl cron curl </mark>                 #安装依赖包

[root@martlet121 ~]# <mark> dnf -y install socat </mark>                #安装依赖包

[root@martlet121 ~]# <mark> curl https://get.acme.sh | sh </mark>                #安装生成证书的脚本命令

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current

​                                 Dload  Upload   Total   Spent    Left  Speed

100  1032    0  1032    0     0  21500      0 --:--:-- --:--:-- --:--:-- 21500

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current

​                                 Dload  Upload   Total   Spent    Left  Speed

100  219k  100  219k    0     0   567k      0 --:--:-- --:--:-- --:--:--  566k

[Sat Aug 17 10:45:47 AM UTC 2024] Installing from online archive.

[Sat Aug 17 10:45:47 AM UTC 2024] Downloading https://github.com/acmesh-official/acme.sh/archive/master.tar.gz

[Sat Aug 17 10:45:48 AM UTC 2024] Extracting master.tar.gz

[Sat Aug 17 10:45:48 AM UTC 2024] It is recommended to install socat first.

[Sat Aug 17 10:45:48 AM UTC 2024] We use socat for the standalone server, which is used for standalone mode.

[Sat Aug 17 10:45:48 AM UTC 2024] If you don't want to use standalone mode, you may ignore this warning.

[Sat Aug 17 10:45:48 AM UTC 2024] Installing to /root/.acme.sh

[Sat Aug 17 10:45:48 AM UTC 2024] Installed to /root/.acme.sh/acme.sh

[Sat Aug 17 10:45:48 AM UTC 2024] Installing alias to '/root/.bashrc'

[Sat Aug 17 10:45:48 AM UTC 2024] Close and reopen your terminal to start using acme.sh

[Sat Aug 17 10:45:48 AM UTC 2024] Installing alias to '/root/.cshrc'

[Sat Aug 17 10:45:48 AM UTC 2024] Installing alias to '/root/.tcshrc'

[Sat Aug 17 10:45:48 AM UTC 2024] Installing cron job

no crontab for root

no crontab for root

[Sat Aug 17 10:45:48 AM UTC 2024] bash has been found. Changing the shebang to use bash as preferred.

[Sat Aug 17 10:45:54 AM UTC 2024] OK

[Sat Aug 17 10:45:54 AM UTC 2024] Install success!

[root@martlet121 ~]# <mark> ./.acme.sh/acme.sh --register-account -m hhh@martlet121.cn </mark>                     #注册账号

[Sat Aug 17 10:53:42 AM UTC 2024] No EAB credentials found for ZeroSSL, let's obtain them

[Sat Aug 17 10:53:44 AM UTC 2024] Registering account: https://acme.zerossl.com/v2/DV90

[Sat Aug 17 10:53:46 AM UTC 2024] Registered

[Sat Aug 17 10:53:46 AM UTC 2024] ACCOUNT_THUMBPRINT='oYiQiff5rI-SDI6sG_sMEWUot9oKdhIHKds3XAwzg70'

[root@martlet121 ~]# <mark> ./.acme.sh/acme.sh --issue -d vpn.martlet121.cn --standalone --keylength ec-256 --force </mark>                   #申请证书，默认有效期只有3个月

| 参数        | 作用                                                         |
| ----------- | ------------------------------------------------------------ |
| --keylength | 密钥长度；字段中有ec表示生成ECC证书，否则就是RSA证书可取值ec-256、ec-384、2048、3072、4096、8192 |

[Sat Aug 17 10:55:05 AM UTC 2024] Using CA: https://acme.zerossl.com/v2/DV90

[Sat Aug 17 10:55:05 AM UTC 2024] Standalone mode.

[Sat Aug 17 10:55:05 AM UTC 2024] Creating domain key

[Sat Aug 17 10:55:05 AM UTC 2024] The domain key is here: /root/.acme.sh/vpn.martlet121.cn_ecc/vpn.martlet121.cn.key

[Sat Aug 17 10:55:05 AM UTC 2024] Single domain='vpn.martlet121.cn'

[Sat Aug 17 10:55:09 AM UTC 2024] Getting webroot for domain='vpn.martlet121.cn'

[Sat Aug 17 10:55:09 AM UTC 2024] Verifying: vpn.martlet121.cn

[Sat Aug 17 10:55:09 AM UTC 2024] Standalone mode server

[Sat Aug 17 10:55:11 AM UTC 2024] Processing. The CA is processing your order, please wait. (1/30)

[Sat Aug 17 10:55:21 AM UTC 2024] Success

[Sat Aug 17 10:55:21 AM UTC 2024] Verification finished, beginning signing.

[Sat Aug 17 10:55:21 AM UTC 2024] Let's finalize the order.

[Sat Aug 17 10:55:21 AM UTC 2024] Le_OrderFinalize='https://acme.zerossl.com/v2/DV90/order/F-4vV-vtp2GGeEEMlLFO9A/finalize'

[Sat Aug 17 10:55:27 AM UTC 2024] Order status is 'processing', let's sleep and retry.

[Sat Aug 17 10:55:27 AM UTC 2024] Sleeping for 15 seconds then retrying

[Sat Aug 17 10:55:43 AM UTC 2024] Polling order status: https://acme.zerossl.com/v2/DV90/order/F-4vV-vtp2GGeEEMlLFO9A

[Sat Aug 17 10:55:45 AM UTC 2024] Downloading cert.

[Sat Aug 17 10:55:45 AM UTC 2024] Le_LinkCert='https://acme.zerossl.com/v2/DV90/cert/bDv0dVhKrnmpWcJ7bqP1Wg'

[Sat Aug 17 10:55:47 AM UTC 2024] Cert success.

-----BEGIN CERTIFICATE-----

MIIEATCCA4agAwIBAgIQDfumEqwE3hfIco3VZpbboTAKBggqhkjOPQQDAzBLMQsw

CQYDVQQGEwJBVDEQMA4GA1UEChMHWmVyb1NTTDEqMCgGA1UEAxMhWmVyb1NTTCBF

Q0MgRG9tYWluIFNlY3VyZSBTaXRlIENBMB4XDTI0MDgxNzAwMDAwMFoXDTI0MTEx

NTIzNTk1OVowGjEYMBYGA1UEAxMPdnBuLnd1enVuaWFvLmNuMFkwEwYHKoZIzj0C

AQYIKoZIzj0DAQcDQgAE8pBRFuJodUbqzF19Bs2iP6/6BYw+Qbxl6080LEjaWPtj

TkGOu9KwO2/ljNdrkan/W/uv+BSFuay0j0VxJDFRIaOCAnswggJ3MB8GA1UdIwQY

MBaAFA9r5kvOOUeu9n6QHnnwMJGSyF+jMB0GA1UdDgQWBBRtpeO8Kzop4tXRnliq

ABKQaepYsDAOBgNVHQ8BAf8EBAMCB4AwDAYDVR0TAQH/BAIwADAdBgNVHSUEFjAU

BggrBgEFBQcDAQYIKwYBBQUHAwIwSQYDVR0gBEIwQDA0BgsrBgEEAbIxAQICTjAl

MCMGCCsGAQUFBwIBFhdodHRwczovL3NlY3RpZ28uY29tL0NQUzAIBgZngQwBAgEw

gYgGCCsGAQUFBwEBBHwwejBLBggrBgEFBQcwAoY/aHR0cDovL3plcm9zc2wuY3J0

LnNlY3RpZ28uY29tL1plcm9TU0xFQ0NEb21haW5TZWN1cmVTaXRlQ0EuY3J0MCsG

CCsGAQUFBzABhh9odHRwOi8vemVyb3NzbC5vY3NwLnNlY3RpZ28uY29tMIIBBAYK

KwYBBAHWeQIEAgSB9QSB8gDwAHYAdv+IPwq2+5VRwmHM9Ye6NLSkzbsp3GhCCp/m

Z0xaOnQAAAGRX/pd5wAABAMARzBFAiEA8bbdYTbhTPvEX4fzLnBUA/W+NpVQh8Ft

gik6Xbc1lEkCIDshfpAdGOSiNFcZXemNfC22N0bhzsGM4ifclJy+C3daAHYAPxdL

T9ciR1iUHWUchL4NEu2QN38fhWrrwb8ohez4ZG4AAAGRX/pdxgAABAMARzBFAiEA

uVU3KVM6c89ONS4l39jFjoMSj8R1qIRBeH7rLCstcfsCIHi38lIkzVsZvm2DYye/

2JA5npZgHGPBp/uRSSe8d6PYMBoGA1UdEQQTMBGCD3Zwbi53dXp1bmlhby5jbjAK

BggqhkjOPQQDAwNpADBmAjEAt0irr5o8AGd2+DfxyrEmtN38Ycfv+THN2Pt9ttDb

w50zUql4zzs1K7Tw0OmndQZaAjEA/KbWRLlw7uWTjJjsOez0zZrG+kAljjHSBLYe

E6Vn6MgiflwBqts2WV4G4ou/qm9t

-----END CERTIFICATE-----

[Sat Aug 17 10:55:47 AM UTC 2024] Your cert is in: /root/.acme.sh/vpn.martlet121.cn_ecc/vpn.martlet121.cn.cer

[Sat Aug 17 10:55:47 AM UTC 2024] Your cert key is in: /root/.acme.sh/vpn.martlet121.cn_ecc/vpn.martlet121.cn.key

[Sat Aug 17 10:55:47 AM UTC 2024] The intermediate CA cert is in: /root/.acme.sh/vpn.martlet121.cn_ecc/ca.cer

[Sat Aug 17 10:55:47 AM UTC 2024] And the full-chain cert is in: /root/.acme.sh/vpn.martlet121.cn_ecc/fullchain.cer

[root@martlet121 ~]# <mark> ./.acme.sh/acme.sh --renew -d vpn.martlet121.cn --force --ecc </mark>                     #acme.sh脚本会每60天自动更新证书，也可以通过当前命令在90天内进行更新

[Sat Aug 17 11:01:28 AM UTC 2024] Renewing: 'vpn.martlet121.cn'

[Sat Aug 17 11:01:28 AM UTC 2024] Renewing using Le_API=https://acme.zerossl.com/v2/DV90

[Sat Aug 17 11:01:29 AM UTC 2024] Using CA: https://acme.zerossl.com/v2/DV90

[Sat Aug 17 11:01:29 AM UTC 2024] Standalone mode.

[Sat Aug 17 11:01:29 AM UTC 2024] Single domain='vpn.martlet121.cn'

[Sat Aug 17 11:01:38 AM UTC 2024] Getting webroot for domain='vpn.martlet121.cn'

[Sat Aug 17 11:01:38 AM UTC 2024] Verifying: vpn.martlet121.cn

[Sat Aug 17 11:01:38 AM UTC 2024] Standalone mode server

[Sat Aug 17 11:01:41 AM UTC 2024] Processing. The CA is processing your order, please wait. (1/30)

[Sat Aug 17 11:01:45 AM UTC 2024] Success

[Sat Aug 17 11:01:45 AM UTC 2024] Verification finished, beginning signing.

[Sat Aug 17 11:01:45 AM UTC 2024] Let's finalize the order.

[Sat Aug 17 11:01:45 AM UTC 2024] Le_OrderFinalize='https://acme.zerossl.com/v2/DV90/order/IS4wSHNIQeYp0tGcVDrwTg/finalize'

[Sat Aug 17 11:01:47 AM UTC 2024] Order status is 'processing', let's sleep and retry.

[Sat Aug 17 11:01:47 AM UTC 2024] Sleeping for 15 seconds then retrying

[Sat Aug 17 11:02:03 AM UTC 2024] Polling order status: https://acme.zerossl.com/v2/DV90/order/IS4wSHNIQeYp0tGcVDrwTg

[Sat Aug 17 11:02:04 AM UTC 2024] Downloading cert.

[Sat Aug 17 11:02:04 AM UTC 2024] Le_LinkCert='https://acme.zerossl.com/v2/DV90/cert/9q6qQObIwz4RVA_t1MDVnw'

[Sat Aug 17 11:02:05 AM UTC 2024] Cert success.

-----BEGIN CERTIFICATE-----

MIIEAjCCA4egAwIBAgIQG8PeoUgSD2/zAsjnlF7alDAKBggqhkjOPQQDAzBLMQsw

CQYDVQQGEwJBVDEQMA4GA1UEChMHWmVyb1NTTDEqMCgGA1UEAxMhWmVyb1NTTCBF

Q0MgRG9tYWluIFNlY3VyZSBTaXRlIENBMB4XDTI0MDgxNzAwMDAwMFoXDTI0MTEx

NTIzNTk1OVowGjEYMBYGA1UEAxMPdnBuLnd1enVuaWFvLmNuMFkwEwYHKoZIzj0C

AQYIKoZIzj0DAQcDQgAE8pBRFuJodUbqzF19Bs2iP6/6BYw+Qbxl6080LEjaWPtj

TkGOu9KwO2/ljNdrkan/W/uv+BSFuay0j0VxJDFRIaOCAnwwggJ4MB8GA1UdIwQY

MBaAFA9r5kvOOUeu9n6QHnnwMJGSyF+jMB0GA1UdDgQWBBRtpeO8Kzop4tXRnliq

ABKQaepYsDAOBgNVHQ8BAf8EBAMCB4AwDAYDVR0TAQH/BAIwADAdBgNVHSUEFjAU

BggrBgEFBQcDAQYIKwYBBQUHAwIwSQYDVR0gBEIwQDA0BgsrBgEEAbIxAQICTjAl

MCMGCCsGAQUFBwIBFhdodHRwczovL3NlY3RpZ28uY29tL0NQUzAIBgZngQwBAgEw

gYgGCCsGAQUFBwEBBHwwejBLBggrBgEFBQcwAoY/aHR0cDovL3plcm9zc2wuY3J0

LnNlY3RpZ28uY29tL1plcm9TU0xFQ0NEb21haW5TZWN1cmVTaXRlQ0EuY3J0MCsG

CCsGAQUFBzABhh9odHRwOi8vemVyb3NzbC5vY3NwLnNlY3RpZ28uY29tMIIBBQYK

KwYBBAHWeQIEAgSB9gSB8wDxAHYAdv+IPwq2+5VRwmHM9Ye6NLSkzbsp3GhCCp/m

Z0xaOnQAAAGRYAAm7gAABAMARzBFAiEA9CDmTq8zc4Hu0sbuWWfCgBKPC80OeH9p

mNvfvlTNjE0CIEqb+nc4Vz3Ij2eFtRCE/2EGHhcX1irxCZ/xzNM0aWGvAHcAPxdL

T9ciR1iUHWUchL4NEu2QN38fhWrrwb8ohez4ZG4AAAGRYAAmmAAABAMASDBGAiEA

6635N34kA10nuxn9QRi0lLRTl2CkTHel77IV9QwmXQ4CIQDpARU+kesr3OFVOr2N

Drex8pzqzzZpiA6zWVIy2v54rjAaBgNVHREEEzARgg92cG4ud3V6dW5pYW8uY24w

CgYIKoZIzj0EAwMDaQAwZgIxALxJ/kPXTGb1lw92i9iDp//lsV0uDiABJGftP8VI

k6We+ofZq940oSlFmQRxdsRvCgIxAMd+tHZ1/bFcJitLT2pWDeM/f+W9pHq6vvLz

wnrVy4efeHfAfbCUDFV5kyjDvbRmYg==

-----END CERTIFICATE-----

[Sat Aug 17 11:02:05 AM UTC 2024] Your cert is in: /root/.acme.sh/vpn.martlet121.cn_ecc/vpn.martlet121.cn.cer

[Sat Aug 17 11:02:05 AM UTC 2024] Your cert key is in: /root/.acme.sh/vpn.martlet121.cn_ecc/vpn.martlet121.cn.key

[Sat Aug 17 11:02:06 AM UTC 2024] The intermediate CA cert is in: /root/.acme.sh/vpn.martlet121.cn_ecc/ca.cer

[Sat Aug 17 11:02:06 AM UTC 2024] And the full-chain cert is in: /root/.acme.sh/vpn.martlet121.cn_ecc/fullchain.cer

[root@martlet121 ~]# <mark> ./.acme.sh/acme.sh --installcert -d vpn.martlet121.cn --ecc --fullchain-file /usr/local/etc/v2ray/v2ray.crt --key-file /usr/local/etc/v2ray/v2ray.key </mark>                      #安装证书和密钥到v2ray的配置文件同级目录，v2ray.key是私钥文件，不能泄露

[Sat Aug 17 11:05:57 AM UTC 2024] Installing key to: /usr/local/etc/v2ray/v2ray.key

[Sat Aug 17 11:05:57 AM UTC 2024] Installing full chain to: /usr/local/etc/v2ray/v2ray.crt

[root@martlet121 ~]# <mark> chmod 777 /usr/local/etc/v2ray/v2ray.* </mark>                       #修改证书文件权限





二、服务器侧配置

[root@martlet121 ~]# <mark> vim /usr/local/etc/v2ray/config.json </mark>                      #修改服务器侧配置文件

```json
{
  "log": {
    "loglevel": "warning",
    "access": "/var/log/v2ray/access.log",               //Linux路径
    "error": "/var/log/v2ray/error.log"
  },
  "inbounds": [
    {
      "port": 443,             //建议使用443端口
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "6603eb89-d26e-46b2-a626-49e18e074a6e",
            "alterId": 0
          }
        ]
      },
      "streamSettings": {
        "network": "tcp",
        "security": "tls",             //security要设置为tls才会启用TLS
        "tlsSettings": {
          "certificates": [
            {
              "certificateFile": "/usr/local/etc/v2ray/v2ray.crt",                //证书文件
              "keyFile": "/usr/local/etc/v2ray/v2ray.key"                   //密钥文件
            }
          ]
        }
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "settings": {}
    }
  ]
}
```

[root@martlet121 ~]# <mark> systemctl restart v2ray </mark>                   #重启服务应用配置

[root@martlet121 ~]# <mark> ps -ef | grep v2ray </mark>                    #默认是nobody账号运行进程，不给证书文件加其他人允许访问的权限就启动不了程序

nobody     65537       1  0 11:25 ?        00:00:00 /usr/local/bin/v2ray run -config /usr/local/etc/v2ray/config.json

root       65553    4838  0 11:26 pts/0    00:00:00 grep --color=auto v2ray

[root@martlet121 ~]#





三、客户端配置

​    打开客户端解压后路径config.json文件，编辑完成后运行v2ray.exe文件

```json
{
  "inbounds": [
    {
      "port": 1080,
      "protocol": "socks",
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
      "protocol": "vmess",
      "settings": {
        "vnext": [
          {
            "address": "vpn.martlet121.cn",                //tls需要域名，所以这里应该填自己的域名
            "port": 443,
            "users": [
              {
                "id": "6603eb89-d26e-46b2-a626-49e18e074a6e",
                "alterId": 0
              }
            ]
          }
        ]
      },
      "streamSettings": {
        "network": "tcp",
        "security": "tls"            //客户端的security也要设置为tls
      }
    }
  ]
}
```





四、验证SSL是否生效

​    在线网站：https://www.ssllabs.com/ssltest/index.html

​    只有在使用443端口时才能用上面网站验证，网站没有提供自定义端口的选项

​    Trusted为Yes表示证书可信


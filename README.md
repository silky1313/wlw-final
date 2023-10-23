## 环境配置
windows下推荐使用Chocolatey软件管理工具配置环境,这个自己去搜，下面是手动配置环境的教程。下面是配置nodejs和mongodb的教程

### nodejs的安装
https://nodejs.org/en 官网下载LTS版本，我的node本是16.17.1，本项目需要的node版本是大于10.0.0。打开node-v18.18.2-x64.msi，这是nodejs的安装包。基本上都是默认,安装路径自己配置一下就行。然后命令行`node -v`和`npm -v`都有版本号就显示成功。

### mongodb的安装和mongodb compass的安装
mongodb compass是mongodb的图形化管理工具，其实使用datagrip一类的数据图图形化管理工具也可以直接连接mongodb数据库, 这个自己网上搜搜教程就行。本文只讲mongodb compass的安装教程。
- mongdodb安装直接打开mongodb-windows-x86_64-7.0.2-signed.msi，然后切记不要选择安装compass否则无法自己选择安装路径。![avoid install compass](../wlw-final/image/avoid%20instal%20mongodbCompass.png)
记得自己选择安装目录，然后在安装目录中打开bin/mongod.exe启动服务。

- mongodb compass的安装就直接选择一路默认就行。

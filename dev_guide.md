# 本文主要讲解开发环境的配置
## 说明
本项目的依赖较少, 只要有合适版本的浏览器和文本编辑器, 既可以开始开发工作.
但是如果要运行改项目, 还需要安装nodejs, 主要是为了解决ajax跨域问题.
## 安装
## 安装依赖包
在项目主目录下执行npm安装命令
```bash
npm install
或者
cnpm install
```

## 启动项目
```bash
npm run start
```
默认监听在9001端口, 若要修改端口, 修改package.json的script区域
```json
"scripts": {
    "start": "npx http-server -p 9001",
  }
```
打开浏览器,访问http://localhost:9001 即可以一览web应用的全貌.
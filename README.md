# 功能
前端小工具，chery-pick工作流，效率小工具

## 开发环境
- node v12.14.0
- yarn 1.22.4
- git 2.24.3

## 安装依赖
```
yarn 
```

## 项目本地启动
```
yarn electron:serve
```

## 项目打包
```
yarn electron:build
```
注意：本地一般打不了，建议用github action 打包

## 使用
- 在Releases下载安装包，现只支持mac很windows
- 用git 功能要本地要装git2.24.3，可撤销conmit、强push、cherry-pick工作流等
- 用swagger功能(可快速复制js对象，生成表头等)，url为：http://ip:端口/v2/api-docs即：后端提供的swagger地址->F12->Network->查找api-docs结尾的->Request URL
- 用yapi功能(可快速复制js对象，生成表头等)，baseUrl为yapi路径http://ip:端口，token在在yapi项目中->设置->token设置
- 设置可以自己添加文档链接比如：加element-ui: https://element.eleme.io/#/zh-CN/component/installation
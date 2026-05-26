# 余量面板

支持查询联通卡速率和QCI

以及支持查询隐藏包。

如果你不了解如何打包vite项目，请[点此下载](https://timerdev.github.io/unicomvue/dist.zip)解压文件部署到服务器根目录即可

或者使用`Docker`部署

```bash
docker run -d --rm -p 8086:80 ghcr.io/timerdev/unicomvue:latest
```

或者使用腾讯云提供的一键部署

[![Use EdgeOne Pages to deploy](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?repository-url=https%3A%2F%2Fgithub.com%2FTimerDev%2Funicomvue)


特性：

1.支持ecs_token登陆

2.更友好的界面

3.支持夜间模式主题切换

# 使用到的接口

```
登录 
https://m.client.10010.com/mobileService/radomLogin.htm

```
滑块或点击认证
https://loginxhm.10010.com/login-web/v1/chartCaptcha/validateTencentCaptcha

```
发短信
https://m.client.10010.com/mobileService/sendRadomNum.htm

已订业务
https://m.client.10010.com/servicebusiness/newOrdered/queryOrderRelationship

5G 信息（余量/用量）https://m.client.10010.com/servicequerybusiness/operationservice/queryOcsPackageFlowLeftContentRevisedInJune"

速率查询
https://m.client.10010.com/servicebusiness/query/fiveg/getbasicdata"
```

## ❓ 疑问解答

### 问：我搭建了一个前端页面，能否添加到跨域白名单？

**答：** 可以，但需要满足以下条件：

- 你的页面已有一定的用户量或明确的使用场景  
- 页面中需添加链接，指向本项目的开源仓库  
- 不用于商业用途，不进行接口滥用或批量请求  

满足以上条件后，请通过项目中提供的联系方式与我联系，视情况加入跨域白名单。

---

### 问：能否添加 xxx 功能？

**答：**  
欢迎提出合理的功能建议或优化想法。

如有实际使用价值的需求，可通过以下方式联系我：

- 提交 GitHub Issue  
- 通过项目中提供的联系邮箱  

我会根据时间精力与实现成本进行评估，但不保证一定实现。

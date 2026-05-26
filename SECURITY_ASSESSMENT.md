# 🔒 安全评估报告 - 2026-05-26

## ✅ 最终确认

### 架构确认
- ✅ **无第三方转发** - 所有数据直接发送至您的后端
- ✅ **后端代理** - 您的后端直接调用联通官方 API
- ✅ **敏感信息流向** - 用户 → 您的后端 → 联通 → 您的后端 → 用户
- ✅ **前期修复** - 已移除所有硬编码（HK中转、邮箱、AppID等）

---

## 🔍 发现的安全风险

### 1. 🟡 **Console 日志输出** (中等风险)
**位置**: [src/views/HomeView.vue](src/views/HomeView.vue)  
**问题**:
```javascript
// 生产环境可见日志
console.debug(`[Auth] Token length: ${token.length} chars`);
console.info('[Auth] Token stored in localStorage');
console.info('[Auth] Token cleared from localStorage');
```

**风险**: 在生产环境中，这些日志可能被记录到日志系统

**修复建议**:
```javascript
// 仅在开发环境输出
if (process.env.NODE_ENV === 'development') {
  console.debug(`[Auth] Token length: ${token.length} chars`);
}
```

### 2. 🟡 **localStorage 存储敏感信息** (中等风险)
**位置**: [src/views/HomeView.vue](src/views/HomeView.vue#L306-L330)  
**敏感数据**:
- `ecs_token` - 认证令牌
- `ecs_acc` - ECS 账户凭证
- `captcha_appid` - 验证码 AppID
- `last_used_phone` - 电话号码历史

**风险**:
- 🔴 XSS 攻击可窃取所有数据
- 🔴 浏览器扩展程序可访问
- 🔴 与网站共享的其他脚本可访问

**现状分析**:
- localStorage 明文存储（无加密）
- 页面关闭时数据仍保留
- 用户在共享电脑上有泄露风险

**改进建议**:
```javascript
// 方案 1: 使用 sessionStorage（仅当前标签页有效）
function getEcsToken() { 
  return sessionStorage.getItem(STORAGE_KEY) || ""; 
}

// 方案 2: 添加自动过期机制
function setEcsToken(token) {
  const expiryTime = Date.now() + 3600000; // 1小时
  localStorage.setItem(STORAGE_KEY, token);
  localStorage.setItem(STORAGE_KEY + '_expiry', expiryTime);
}

// 方案 3: 浏览器关闭时清理
window.addEventListener('beforeunload', () => {
  clearEcsToken();
  clearEcsAcc();
});
```

### 3. 🟢 **电话号码历史** (低风险)
**位置**: [src/views/HomeView.vue](src/views/HomeView.vue#L268)  
**说明**: 
- 存储 `last_used_phone` 便于下次登录
- 虽然是相对公开信息，但仍是 PII

**改进建议**:
- 添加用户明确同意机制
- 或改为存储掩码后的号码（如 137\*\*\*\*1234）

---

## ✅ 已检查且安全的方面

| 项目 | 状态 | 说明 |
|------|------|------|
| 第三方转发 | ✅ | 不存在 - 所有请求发送到您的后端 |
| 硬编码敏感值 | ✅ | 已全部移除 |
| 敏感 URL 参数 | ✅ | 未发现敏感信息在 URL 中 |
| HTTP 链接 | ✅ | 仅 localhost 使用 HTTP，生产应使用 HTTPS |
| XSS 防护 | ✅ | Vue 自动转义模板 |
| CORS 配置 | ✅ | 本地代理无跨域问题 |

---

## 🎯 优先级建议

### 优先级 1（立即改进）
```javascript
// ❌ 移除或限制 console 日志
if (process.env.NODE_ENV === 'development') {
  console.info('[Auth] Token stored in localStorage');
}
```

### 优先级 2（重要）
- 考虑使用 sessionStorage 替代 localStorage
- 添加 1 小时自动过期机制
- 实现浏览器关闭时自动清理

### 优先级 3（改进）
- 手机号码历史添加用户同意
- 实现"无痕模式"选项
- 定期安全审计

---

## 🔐 生产部署建议

### Docker 环境
```bash
# Dockerfile
FROM node:20 as build
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# 生产环境禁用调试日志
ENV NODE_ENV=production
```

### 反向代理配置 (Nginx)
```nginx
server {
  listen 443 ssl http2;
  server_name your-domain.com;

  # SSL 配置
  ssl_certificate /etc/nginx/ssl/cert.pem;
  ssl_certificate_key /etc/nginx/ssl/key.pem;
  ssl_protocols TLSv1.2 TLSv1.3;
  
  # 安全头
  add_header Strict-Transport-Security "max-age=31536000" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;

  # 前端
  location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
  }

  # 后端代理
  location /api {
    proxy_pass http://backend:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

### 环境变量
```bash
# 生产环境应使用
VITE_MAIN_API=https://your-domain.com/api
NODE_ENV=production
```

---

## 📋 安全检查清单

### 部署前检查
- [ ] 生产环境设置 `NODE_ENV=production`
- [ ] 所有 API 调用使用 HTTPS
- [ ] 启用安全响应头（见上述 Nginx 配置）
- [ ] 后端实现请求日志（不记录敏感数据）
- [ ] 后端实现速率限制
- [ ] 后端实现请求签名验证

### 持续监控
- [ ] 定期查看生产日志
- [ ] 监控异常登录尝试
- [ ] 检查后端错误日志
- [ ] 定期安全审计（建议每季度）

---

## 📞 后端建议实现

您的后端需要实现：

```javascript
// POST /gettoken
{
  request: { phone, code, appid },
  response: {
    status: 'success',
    ecs_token: '...',
    ecs_acc: '...',        // 生产环境应该返回
    captcha_appid: '...',  // 生产环境应该返回
    token_online: '...'
  }
}

// POST /ocs_proxy
{
  request: { ecs_token, ecs_acc },
  response: { /* 联通官方响应 */ }
}

// 类似地代理其他接口...
```

**后端安全建议**:
- ✅ 不记录完整的 token 和凭证
- ✅ 实现请求速率限制
- ✅ 验证 token 有效期
- ✅ 记录所有登录尝试
- ✅ 使用 HTTPS 与联通官方通信

---

## 总结

### 现状
✅ **整体安全评分: 7.5/10**

**强项**:
- 无第三方数据转发
- 架构清晰合理
- 敏感硬编码已移除

**需改进**:
- console 日志在生产环境应禁用
- localStorage 应考虑改为 sessionStorage
- 应添加 token 自动过期机制

**建议**:
按照优先级逐步改进，大部分是非紧急的优化。当前架构已经相对安全。

---

**评估完成日期**: 2026-05-26  
**下次审计建议**: 2026-08-26

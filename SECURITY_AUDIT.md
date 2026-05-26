# 🔒 安全审计报告 - UnicomVue

## 问题发现时间
2026-05-26

## 已修复的安全风险

### 1. ✅ API 地址硬编码
**位置**: [src/views/HomeView.vue](src/views/HomeView.vue#L215)  
**风险等级**: 🔴 **高**  
**问题**: 
- MAIN_API 写死为 `https://networkapi.2t.hk`
- 所有网络请求都发往此地址，包含敏感信息

**修复方案**:
- 改用环境变量 `VITE_MAIN_API`
- 配置文件位置: `.env.local` (已在 .gitignore 中)
- 示例配置: `.env.example`

---

### 2. ✅ ECS_ACC 凭证硬编码
**位置**: [src/views/HomeView.vue](src/views/HomeView.vue#L225)  
**风险等级**: 🔴 **高**  
**问题**:
- Base64 编码的凭证直接写在源代码中
- 被 git 版本管理，泄露风险极高
- 在生产环境中可被提取和滥用

**修复方案**:
- 改用环境变量 `VITE_ECS_ACC`
- 本地开发使用 `.env.local`
- 生产部署使用系统环境变量或密钥管理服务

---

### 3. ✅ Captcha AppID 硬编码
**位置**: [src/views/HomeView.vue](src/views/HomeView.vue#L224)  
**风险等级**: 🟡 **中**  
**问题**:
- 腾讯验证码 AppID (`195809716`) 硬编码
- 被关联到特定应用，可能被恶意使用

**修复方案**:
- 改用环境变量 `VITE_CAPTCHA_APPID`
- 支持通过配置切换不同的 AppID

---

### 4. ✅ 邮箱地址硬编码
**位置**: 
- [src/App.vue](src/App.vue)
- [src/components/FooterView.vue](src/components/FooterView.vue#L84)
- [src/components/PrivacyModal.vue](src/components/PrivacyModal.vue#L116)

**风险等级**: 🟡 **中**  
**问题**:
- 联系邮箱 `aliya@nbcnm.cn` 在多处硬编码
- 邮箱与组织相关联，可能引发安全问题

**修复方案**:
- 改用环境变量 `VITE_CONTACT_EMAIL`
- 通过 props 传递配置值

---

### 5. ✅ 配置分散在代码中
**位置**: [src/views/HomeView.vue](src/views/HomeView.vue#L212-226)  
**风险等级**: 🟡 **中**  
**问题**:
- 所有配置硬编码在视图组件中
- 修改配置需要重新构建
- 难以维护不同环境的配置

**修复方案**:
- 创建 [src/config.js](src/config.js) 集中管理配置
- 所有敏感配置从环境变量读取
- 提供 validateConfig() 验证配置完整性

---

## 已修复的敏感信息风险

### 6. 🔴 LocalStorage 存储敏感 Token
**位置**: [src/views/HomeView.vue](src/views/HomeView.vue#L306-308)  
**风险等级**: 🔴 **高**  
**问题**:
- `ecs_token` 存储在 LocalStorage（明文）
- 可被 XSS 攻击读取
- 跨标签页共享，风险范围大

**当前状态**:
- 已识别为已知风险（见隐私协议）
- 用户需要了解此风险

**建议的改进**:
- 🎯 使用 SessionStorage 替代 LocalStorage（仅限当前标签页）
- 🎯 考虑实现内存加密存储
- 🎯 添加自动过期机制（例如1小时）
- 🎯 提供无痕模式（禁用本地存储）

---

## 未修复但建议关注的风险

### 7. ⚠️ 电话号码存储
**位置**: [src/views/HomeView.vue](src/views/HomeView.vue#L268)  
**风险等级**: 🟠 **中-低**  
**问题**:
- 用户电话号码保存在 LocalStorage
- 虽然是公开信息，但仍存隐私泄露风险

**建议修复**:
```javascript
// 当前代码
const loginPhone = ref(localStorage.getItem(PHONE_HISTORY_KEY) || "");

// 建议修改 - 添加用户明确同意
const loginPhone = ref(
  userHasConsentedPhoneStorage() ? 
    localStorage.getItem(PHONE_HISTORY_KEY) : 
    ""
);
```

---

## 安全配置使用指南

### 开发环境配置
```bash
# 1. 复制示例文件
cp .env.example .env.local

# 2. 编辑 .env.local，填入实际配置
VITE_MAIN_API=https://networkapi.2t.hk
VITE_ECS_ACC=your_actual_base64_credential
VITE_CAPTCHA_APPID=195809716
VITE_CONTACT_EMAIL=support@example.com

# 3. 启动开发服务器
npm run dev
```

### 生产环境部署
```bash
# Docker 方式
docker run -d \
  -e VITE_MAIN_API=https://api.example.com \
  -e VITE_ECS_ACC=$SECRET_ECS_ACC \
  -e VITE_CAPTCHA_APPID=$CAPTCHA_ID \
  -e VITE_CONTACT_EMAIL=support@example.com \
  ghcr.io/timerdev/unicomvue:latest

# 或使用 Kubernetes Secrets
kubectl set env deployment/unicom \
  --from=secret/unicom-secrets
```

---

## 检查清单

- ✅ MAIN_API 改用环境变量
- ✅ ECS_ACC 改用环境变量  
- ✅ CAPTCHA_APPID 改用环境变量
- ✅ Contact Email 改用环境变量
- ✅ 创建集中配置管理 (config.js)
- ✅ 添加配置验证函数
- ✅ .env.local 已在 .gitignore
- ✅ 应用启动时验证配置
- ⏳ **待改进**: SessionStorage 代替 LocalStorage
- ⏳ **待改进**: Token 自动过期机制
- ⏳ **待改进**: 敏感信息加密存储

---

## 下一步行动

### 优先级 1（紧急）
- ☑️ 已完成：将敏感配置迁移到环境变量
- ☑️ 已完成：更新部署文档

### 优先级 2（重要）
- ⏳ 实现 SessionStorage 存储机制
- ⏳ 添加 Token 自动过期（建议1小时）
- ⏳ 实现敏感信息内存加密

### 优先级 3（改进）
- ⏳ 添加安全日志
- ⏳ 实现无痕模式
- ⏳ 定期安全审计流程

---

## 相关文件

- 配置定义: [src/config.js](src/config.js)
- 配置示例: [.env.example](.env.example)
- 本地配置: [.env.local](.env.local) *(不提交)*
- 忽略规则: [.gitignore](.gitignore)

---

## 验证修复

```bash
# 检查是否有明文敏感信息残留
grep -r "https://networkapi" src/ --exclude-dir=node_modules
grep -r "sGPt3BqyB" src/ --exclude-dir=node_modules
grep -r "195809716" src/ --exclude-dir=node_modules
grep -r "aliya@nbcnm.cn" src/ --exclude-dir=node_modules

# 结果应该为空或仅在示例/注释中出现
```

---

**审计完成于**: 2026-05-26  
**下次审计建议**: 每季度进行一次安全审计

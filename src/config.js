/**
 * 应用配置
 *
 * 架构说明：
 * - 前端只需配置本地后端 API 地址
 * - ECS_ACC 和 CAPTCHA_APPID 由后端在登录时返回，前端缓存使用
 * - 登出时自动清理缓存
 */

export const config = {
  // API 地址（本地后端）
  // 开发: http://localhost:3000
  // 生产: 通过 VITE_MAIN_API 环境变量或直接修改
  mainApi: import.meta.env.VITE_MAIN_API || 'http://localhost:3000',

  // API 端点
  get loginApi() {
    return this.mainApi + '/gettoken';
  },
  get ocsApi() {
    return this.mainApi + '/ocs_proxy';
  },
  get basicApi() {
    return this.mainApi + '/basicdata_proxy';
  },
  get qciApi() {
    return this.mainApi + '/qci_proxy';
  },

  // 数据刷新间隔（毫秒）
  refreshIntervalMs: 30_000,

  // LocalStorage 键名
  storageKeys: {
    ecsToken: 'ecs_token',
    ecsAcc: 'ecs_acc',              // 登录时从API获取，存储在缓存
    captchaAppId: 'captcha_appid',  // 登录时从API获取，存储在缓存
    phoneHistory: 'last_used_phone',
    theme: 'theme'
  },

  // 验证规则
  validators: {
    isValidPhone: (phone) => /^1\d{10}$/.test(phone)
  }
};

/**
 * 配置验证
 */
export function validateConfig() {
  console.log('✅ 配置就绪，API 地址:', config.mainApi);
  return true;
}

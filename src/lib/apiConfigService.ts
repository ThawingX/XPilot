/**
 * API配置管理服务
 * 用于在开发环境中动态切换API地址
 */

class ApiConfigService {
  private static instance: ApiConfigService;
  private currentApiUrl: string;
  private listeners: ((url: string) => void)[] = [];

  private constructor() {
    // 从localStorage读取用户选择，如果没有则使用环境变量默认值
    const savedChoice = localStorage.getItem('dev_use_local_api');
    const useLocal = savedChoice ? savedChoice === 'true' : true;
    
    this.currentApiUrl = useLocal 
      ? 'http://localhost:8000'
      : 'https://pilotapi.producthot.top';
  }

  public static getInstance(): ApiConfigService {
    if (!ApiConfigService.instance) {
      ApiConfigService.instance = new ApiConfigService();
    }
    return ApiConfigService.instance;
  }

  /**
   * 获取当前API基础URL
   */
  public getApiBaseUrl(): string {
    // 在生产环境中，始终使用环境变量
    if (import.meta.env.PROD) {
      return import.meta.env.VITE_API_BASE_URL || 'https://pilotapi.producthot.top';
    }
    
    // 在开发环境中，使用动态配置
    return this.currentApiUrl;
  }

  /**
   * 设置API基础URL
   */
  public setApiBaseUrl(url: string): void {
    if (import.meta.env.PROD) {
      console.warn('Cannot change API URL in production environment');
      return;
    }

    this.currentApiUrl = url;
    
    // 保存用户选择到localStorage
    const isLocal = url.includes('localhost');
    localStorage.setItem('dev_use_local_api', isLocal.toString());
    
    // 通知所有监听器
    this.listeners.forEach(listener => listener(url));
  }

  /**
   * 切换本地和生产环境API
   */
  public toggleApiEnvironment(): boolean {
    if (import.meta.env.PROD) {
      console.warn('Cannot toggle API environment in production');
      return false;
    }

    const isCurrentlyLocal = this.currentApiUrl.includes('localhost');
    const newUrl = isCurrentlyLocal 
      ? 'https://pilotapi.producthot.top'
      : 'http://localhost:8000';
    
    this.setApiBaseUrl(newUrl);
    return !isCurrentlyLocal;
  }

  /**
   * 检查当前是否使用本地API
   */
  public isUsingLocalApi(): boolean {
    return this.currentApiUrl.includes('localhost');
  }

  /**
   * 添加URL变更监听器
   */
  public addListener(listener: (url: string) => void): void {
    this.listeners.push(listener);
  }

  /**
   * 移除URL变更监听器
   */
  public removeListener(listener: (url: string) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * 获取所有可用的API环境配置
   */
  public getAvailableEnvironments() {
    return {
      local: {
        name: '本地开发环境',
        url: 'http://localhost:8000',
        description: '本地开发服务器',
        active: this.isUsingLocalApi()
      },
      production: {
        name: '生产环境',
        url: 'https://pilotapi.producthot.top',
        description: '生产环境API服务器',
        active: !this.isUsingLocalApi()
      }
    };
  }

  /**
   * 重置为默认配置
   */
  public resetToDefault(): void {
    if (import.meta.env.PROD) {
      console.warn('Cannot reset API configuration in production');
      return;
    }

    localStorage.removeItem('dev_use_local_api');
    this.currentApiUrl = 'http://localhost:8000';
    this.listeners.forEach(listener => listener(this.currentApiUrl));
  }
}

// 导出单例实例
export const apiConfigService = ApiConfigService.getInstance();
export default apiConfigService;

// 便捷函数
export const getApiBaseUrl = () => apiConfigService.getApiBaseUrl();
export const setApiBaseUrl = (url: string) => apiConfigService.setApiBaseUrl(url);
export const toggleApiEnvironment = () => apiConfigService.toggleApiEnvironment();
export const isUsingLocalApi = () => apiConfigService.isUsingLocalApi();
export interface IConfigManager {
    get(key: string): string| IAppConfig | undefined;
    get env(): Environment;
}

export type Environment = 'production' | 'test' | 'development' | 'staging' | 'uat' | 'pilot' | 'pre' | 'perf'
export interface IAppConfig extends Record<string, string> {
    appName: string;
    environment: Environment;
}
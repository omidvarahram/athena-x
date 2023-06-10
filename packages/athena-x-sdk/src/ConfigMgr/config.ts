export interface IConfigManager {
    get(key: string): string| IConfiguration;
}

export type Environment = 'production' | 'test' | 'development'
export type IConfiguration = Record<Environment, Record<string, string>>
export interface IAppConfig {
    appName: string;
    configuration?: IConfiguration;
}
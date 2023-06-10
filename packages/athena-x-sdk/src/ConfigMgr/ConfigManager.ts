import {IAppConfig, IConfigManager, IConfiguration} from "./config";

export class ConfigManager implements IConfigManager {
    public static ConfigManagerInstance: ConfigManager | null = null;
    private config: IAppConfig;
    private readonly env: string;

    constructor(env: string) {
        this.env = env;
    }

    public static async CreateConfigManagerInstance(env: string, overrideConfig?: IAppConfig): Promise<ConfigManager> {
        if (!this.ConfigManagerInstance) {
            this.ConfigManagerInstance = new ConfigManager(env);
            await this.ConfigManagerInstance.init(overrideConfig);
        } else {
            console.warn('ConfigManager: ConfigManager is already initialised')
        }

        return this.ConfigManagerInstance
    }

    private init(overridingConfig?: IAppConfig) {
        const config: IAppConfig = JSON.parse(process.env[this.env] as string);

        this.config = {
            ...config,
            ...overridingConfig
        };
    }

    public get(key?: string): string | IConfiguration {
        if(key === 'appName') {
            return this.config?.appName;
        }

        if(key === 'env') {
            return this.env
        }

        if(!key) {
            return this.config.configuration
        }

        const prefix = `${this.config?.appName}_`;

        const prefixedKey = `${prefix}${key}`;
        if (Object.keys(this.config.configuration[this.env]).includes(prefixedKey)) {
            return this.config.configuration[this.env][`${prefixedKey}`];
        } else {
            console.error(`${key} not found.`)
        }
    }
}

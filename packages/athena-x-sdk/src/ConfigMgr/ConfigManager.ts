import {Environment, IAppConfig, IConfigManager} from "./config";

export class ConfigManager implements IConfigManager {
    public static ConfigManagerInstance: ConfigManager | null = null;
    private config?: IAppConfig;

    private constructor() {
    }

    public static CreateConfigManagerInstance(prefix?: string, overrideConfig?: IAppConfig): ConfigManager {
        if (!this.ConfigManagerInstance) {
            this.ConfigManagerInstance = new ConfigManager();
            this.ConfigManagerInstance.init(prefix, overrideConfig);
        } else {
            console.warn('ConfigManager: ConfigManager is already initialised')
        }

        return this.ConfigManagerInstance
    }

    private init(prefix: string = '', overridingConfig?: IAppConfig) {
        if (process.env[`${prefix}appName`] && process.env[`${prefix}environment`]) {
            const config: IAppConfig = process.env as unknown as IAppConfig;
            const normalizedConfig = !!prefix.length ? Object.keys(config)
                .filter(key => key.startsWith(prefix))
                .reduce((result, key) => {
                    const newKey = key.replace(prefix, '');
                    result[newKey] = config[key];
                    return result;
                }, {}) : config;
            this.config = {
                ...normalizedConfig,
                ...overridingConfig
            };
        } else {
            throw new Error('ConfigManager: appName and environment are mandatory. Please provide them in .env file')
        }
    }

    public get env(): Environment {
        return this.get('environment') as Environment
    }

    public get(key?: string): string | IAppConfig | undefined {
        if (!key) {
            return this.config;
        }

        if (this.config && Object.keys(this.config).includes(key)) {
            return this.config[key];
        } else {
            console.error(`${key} not found.`)
        }
    }
}

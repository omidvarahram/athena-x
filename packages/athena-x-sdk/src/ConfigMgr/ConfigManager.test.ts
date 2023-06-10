import { ConfigManager } from "./ConfigManager";

// Mock environment
const mockEnv = {
    appName: "TestApp",
    configuration: {
        prod: {
            TestApp_url: "http://prod.api.com"
        },
        test: {
            TestApp_url: "http://test.api.com"
        },
        dev: {
            TestApp_url: "http://dev.api.com"
        }
    },
};

describe('ConfigManager', () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
        // Store the original environment
        originalEnv = { ...process.env };
    });

    afterEach(() => {
        // Restore the original environment
        process.env = originalEnv;
        jest.restoreAllMocks();
        ConfigManager.ConfigManagerInstance = null;
    });

    it('should create a new instance if one does not exist', async () => {
        process.env['test'] = JSON.stringify(mockEnv);

        const instance = await ConfigManager.CreateConfigManagerInstance('test');

        expect(instance).toBeInstanceOf(ConfigManager);
        expect(instance['config']).toEqual(mockEnv);
    });

    it('should not create a new instance if one already exists', async () => {
        process.env['test'] = JSON.stringify(mockEnv);
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

        await ConfigManager.CreateConfigManagerInstance('test');
        await ConfigManager.CreateConfigManagerInstance('test');

        expect(consoleWarnSpy).toBeCalledWith('ConfigManager: ConfigManager is already initialised');
    });

    it('should get the value of a given key', async () => {
        process.env['test'] = JSON.stringify(mockEnv);

        const instance = await ConfigManager.CreateConfigManagerInstance('test');
        const value = instance.get('url');

        expect(value).toBe(mockEnv.configuration.test['TestApp_url']);
    });

    it('should log an error if the key is not found', async () => {
        process.env['test'] = JSON.stringify(mockEnv);
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        const instance = await ConfigManager.CreateConfigManagerInstance('test');
        instance.get('nonexistentKey');

        expect(consoleErrorSpy).toBeCalledWith('nonexistentKey not found.');
    });

    it('should return the environment when "env" key is used', async () => {
        process.env['test'] = JSON.stringify(mockEnv);

        const instance = await ConfigManager.CreateConfigManagerInstance('test');
        const env = instance.get('env');

        expect(env).toBe('test');
    });

    it('should return the app name when "appName" key is used', async () => {
        process.env['test'] = JSON.stringify(mockEnv);

        const instance = await ConfigManager.CreateConfigManagerInstance('test');
        const appName = instance.get('appName');

        expect(appName).toBe('TestApp');
    });

    it('should return the entire configuration when no key is used', async () => {
        process.env['test'] = JSON.stringify(mockEnv);

        const instance = await ConfigManager.CreateConfigManagerInstance('test');
        const config = instance.get();

        expect(config).toEqual(mockEnv.configuration);
    });
});

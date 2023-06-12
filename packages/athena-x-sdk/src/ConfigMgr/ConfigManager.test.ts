import { ConfigManager } from './ConfigManager';
import { Environment, IAppConfig } from './config';
import * as process from "process";

describe('ConfigManager cases', () => {
    const originalProcessEnv = process.env;

    beforeEach(() => {
        process.env.appName = 'testApp';
        process.env.environment = 'test';
        process.env['TEST_KEY'] = 'TEST_VALUE';
    })

    afterEach(() => {
        Object.keys(process.env).forEach((key) => {
                delete process.env[key];
        });
        Object.assign(process.env, originalProcessEnv);
    });

    it('should create a new instance if one does not exist', () => {
        const instance = ConfigManager.CreateConfigManagerInstance();
        expect(instance).toBeInstanceOf(ConfigManager);
    });

    it('should not create a new instance if one already exists', () => {
        const firstInstance = ConfigManager.CreateConfigManagerInstance();
        const secondInstance = ConfigManager.CreateConfigManagerInstance();
        expect(firstInstance).toBe(secondInstance);
    });

    it('should return the value of a given key', () => {
        const instance = ConfigManager.CreateConfigManagerInstance();
        expect(instance.get('TEST_KEY')).toBe('TEST_VALUE');
    });


    it('should return the config object without of a given key', () => {
        const instance = ConfigManager.CreateConfigManagerInstance();
        expect((instance.get() as IAppConfig).appName).toBe('testApp');
        expect((instance.get() as IAppConfig).environment).toBe('test');
        expect((instance.get() as IAppConfig)['TEST_KEY']).toBe('TEST_VALUE');
    });

    it('should return undefined if the key is not found', () => {

        const instance = ConfigManager.CreateConfigManagerInstance();
        expect(instance.get('INVALID_KEY')).toBeUndefined();
    });

    it('should return the environment when "env" getter is used', () => {
        const instance = ConfigManager.CreateConfigManagerInstance();
        expect(instance.env).toBe('test' as Environment);
    });
});

describe('ConfigManager error cases', () => {
    const originalProcessEnv = process.env;
    beforeAll(() => {
        Object.keys(process.env).forEach((key) => {
            delete process.env[key];
        });
        Object.assign(process.env, originalProcessEnv);
    });

    it('should throw error if appName or environment not provided', () => {
        Promise.resolve(() => {
            process.env.appName = undefined;
        }).then(() => {
            try {
                (ConfigManager as any).ConfigManagerInstance = null
                const mgr = ConfigManager.CreateConfigManagerInstance();
                if (!mgr) {
                    fail()
                }
            } catch (e) {
                expect(e).toEqual(new Error('ConfigManager: appName and environment are mandatory. Please provide them in .env file'));
            }
        })
    });
});


describe('ConfigManager cases', () => {
    beforeEach(() => {
        process.env.REACT_APP_appName = 'testApp2';
        process.env.REACT_APP_environment = 'test2';
        process.env.REACT_APP_TEST_KEY = 'TEST_VALUE2';
    })

    it('should return the config object with prefix', () => {
        (ConfigManager as any).ConfigManagerInstance = null
        const instance = ConfigManager.CreateConfigManagerInstance('REACT_APP_');
        expect((instance.get() as IAppConfig).appName).toBe('testApp2');
        expect((instance.get() as IAppConfig).environment).toBe('test2');
        expect((instance.get() as IAppConfig)['TEST_KEY']).toBe('TEST_VALUE2');
    });
});
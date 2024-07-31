import { Config, APIConfig } from '@/types/config.types';
import createLogger from '@/utils/logger';
import fs from 'fs';

export default class ConfigManager {
    logger = createLogger("%c[ConfigManager]", "color: #a02d2a;");

    constructor() {
        if (!fs.existsSync('config.json')) {
            this.createConfig();
        } else {
            this.checkAndUpdateConfig();
        }
    }

    defaultConfig: Config = {
        prefix: "%c[Logger]",
        style: "color: #a02d2a; font-weight: bold",
        token: "YOUR_BOT_TOKEN",
        clientId: "YOUR_CLIENT_ID",
        debug: false,
        db: {
            provider: "mysql",
            fileName: "database.sqlite",
            database: "database",
            host: "localhost",
            user: "root",
            password: "password",
            port: 3306,
        },
        mc: {
            rouletteChannel: "ROULETTE_CHANNEL_ID",
        },
        discord: {
            guillMemberRoleId: "MEMBER_ROLE_ID",
            guildWelcomeChannelId: "WELCOME_CHANNEL_ID",
        },
        api: {
            url: "localhost:3000",
            port: 3000,
            uid: "YOUR_API_UID",
            secret: "YOUR_API_SECRET",
            callbackUrl: "http://localhost:3000/callback",
        }
    };

    createConfig() {
        fs.writeFileSync('config.json', JSON.stringify(this.defaultConfig, null, 4));
        this.logger.log("Config file created");
    }

    checkAndUpdateConfig() {
        const config = this.getConfig();
        let updated = false;

        const updateConfig = <K extends keyof Config>(key: K, defaultValue: Config[K]) => {
            if (!(key in config)) {
                config[key] = defaultValue;
                updated = true;
            }
        };

        // Check for missing fields in the root level
        updateConfig('prefix', this.defaultConfig.prefix);
        updateConfig('style', this.defaultConfig.style);
        updateConfig('token', this.defaultConfig.token);
        updateConfig('clientId', this.defaultConfig.clientId);
        updateConfig('debug', this.defaultConfig.debug);

        // Check for missing fields in the nested 'api' object
        if (!config.api) {
            config.api = this.defaultConfig.api;
            updated = true;
        } else {
            const updateApiConfig = <K extends keyof APIConfig>(key: K, defaultValue: APIConfig[K]) => {
                if (!(key in config.api)) {
                    config.api[key] = defaultValue;
                    updated = true;
                }
            };
            updateApiConfig('url', this.defaultConfig.api.url);
            updateApiConfig('uid', this.defaultConfig.api.uid);
            updateApiConfig('secret', this.defaultConfig.api.secret);
        }

        // If the config was updated, write the changes back to the file
        if (updated) {
            fs.writeFileSync('config.json', JSON.stringify(config, null, 4));
            this.logger.log("Config file updated with missing fields");
        }
    }

    getConfig(): Config {
        const rawData = fs.readFileSync('config.json', 'utf8');
        return JSON.parse(rawData) as Config;
    }

    set<T extends keyof Config>(key: T, value: Config[T]) {
        const config = this.getConfig();
        config[key] = value;
        fs.writeFileSync('config.json', JSON.stringify(config, null, 4));
    }

    get(key: keyof Config) {
        const config = this.getConfig();
        return config[key].toString();
    }
}

import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';
import ConfigManager from '@/config/config';
import createLogger from '@/utils/logger'

export default class BotApi {
    private app: Express;
    private server: http.Server;
    private config: ConfigManager;
    logger = createLogger("%c[API]", "color: #a02d2a;");

    constructor() {
        this.app = express();
        this.app.use(morgan('dev'));
        this.server = http.createServer(this.app);
        this.config = new ConfigManager();
    }

    start() {
        this.server.listen(this.config.getConfig().api.port, () => {
            this.logger.log(`API is running on port ${this.config.getConfig().api.port}`)
        });
    }
}
import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';
import ConfigManager from '@/config/config';
import createLogger from '@/utils/logger'
import routes from './routes';
import bodyParser from 'body-parser';

export default class BotApi {
    private server: http.Server;
    private configManager: ConfigManager;
    logger = createLogger("%c[API]", "color: #a02d2a;");
    public app: express.Application;

    constructor() {
        this.app = express();
        this.configManager = new ConfigManager();
        this.config();
    }

    public config(): void {
        this.app.set('port', this.configManager.getConfig().api.port);
        this.app.use(express.json());
        this.app.use(morgan('dev'));
        this.app.use(bodyParser);
        this.app.use(express.urlencoded({ extended: false }));
        routes(this.app)
    }

    public start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server listening in port 3000');
        });
    }
}

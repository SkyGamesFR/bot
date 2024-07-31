import { Dialect, Sequelize } from 'sequelize';
import { DB } from '../types/config.types';
import createLogger from '@/utils/logger';
import Player from '@/db/models/player.model';
import Roulette from '@/db/models/roulette.model';

export default class Database {
    private db: Sequelize;
    private config: DB;
    private logger = createLogger("%c[DB]", "color: #a02d2a;");

    constructor(config: DB) {
        this.config = config;
        this.db = new Sequelize({
            dialect: config.provider as Dialect || 'sqlite',
            storage: config.database,
            logging: msg => this.logger.log(msg),
            host: this.isSqlite() ? undefined : config.host,
            port: this.isSqlite() ? undefined : config.port,
            username: this.isSqlite() ? undefined : config.user,
            password: this.isSqlite() ? undefined : config.password,
            database: this.isSqlite() ? undefined : config.database,
        });

        this.db.authenticate()
            .then(() => {
                this.logger.log('Connection has been established successfully.');
                this.syncModels();
            })
            .catch((error) => {
                this.logger.error('Unable to connect to the database: ' + error);
            });
    }

    private isSqlite() {
        return this.config.provider === 'sqlite';
    }

    private async syncModels() {
        try {
            Player.initModel(this.db); // Initialize Player model
            Roulette.initModel(this.db); // Initialize Roulette model
            
            await this.db.sync({ force: false }); // Set force to true to recreate tables if needed
            this.logger.log('Models synchronized successfully.');
        } catch (error) {
            this.logger.error('Error synchronizing models: ' + error);
        }
    }
}

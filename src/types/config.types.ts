
export interface APIConfig {
    url: string;
    callbackUrl: string;
    uid: string;
    secret: string;
    port: number;
}

export interface DB {
    provider: string;
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

export interface Discord {
    guillMemberRoleId: string;
    guildWelcomeChannelId: string;
}

export interface Config {
    prefix: string;
    style: string;
    token: string;
    clientId: string;
    debug: boolean;
    db: DB;
    api: APIConfig;
    discord: Discord
}
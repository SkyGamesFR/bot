import ConfigManager from "@/config/config";
import createLogger from "../utils/logger";
import { Client, Collection, IntentsBitField, Partials, PresenceUpdateStatus } from "discord.js";
import { getType } from "@/utils/utils";
import path from "path";
import fs from "fs";
import { Command, SlashCommand } from "@/types";
import { Player } from "discord-player";
import Database from "@/db/database";

export default class DiscordClient extends Client {
    logger = createLogger("%c[Client]", "color: #a02d2a;");
    commands: Collection<string, Command>;
    slashCommands: Collection<string, SlashCommand>;
    cooldowns = new Collection<string, number>();
    config: ConfigManager;
    player: Player;
    db: Database;

    constructor() {
        super({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.MessageContent,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildVoiceStates,
            ],
            partials: [Partials.User, Partials.Message, Partials.Reaction],
            presence: {
                activities: [
                    {
                        name: "SkyGames | 2024",
                        type: getType("WATCHING"),
                    },
                ],
                status: PresenceUpdateStatus.Online,
            },
        });

        this.commands = new Collection();
        this.slashCommands = new Collection();
        this.cooldowns = new Collection();
        this.config = new ConfigManager();
        this.player = new Player(this);
        this.player.extractors.loadDefault();
        this.db = new Database(this.config.getConfig().db);
    }

    async start() {
        try {
            await this.login(this.config.getConfig().token.toString());
            this.logger.log("Logged in successfully.");

            const handlersDir = path.join(__dirname, "../handlers");
            fs.readdirSync(handlersDir).forEach(async (file) => {
                if (!file.endsWith(".ts")) return;
                const HandlerClass = (await import(`${handlersDir}/${file}`)).default;
                new HandlerClass(this);
            });

            this.logger.log("Handlers loaded successfully.");
        } catch (error) {
            this.logger.error("An error occurred while logging in: " + error);
        }
        return this;
    }

    static getClient() {
        return new DiscordClient();
    }
}

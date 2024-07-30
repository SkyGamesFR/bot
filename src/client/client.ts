import ConfigManager from "@/config/config";
import createLogger from "../utils/logger";
import { Client, Collection, IntentsBitField, Partials, PresenceUpdateStatus } from "discord.js";
import { getType } from "@/utils/utils";
import path from "path";
import fs from "fs";
import { Command, SlashCommand } from "@/types";
import { Player } from "discord-player";

export default class DiscordClient extends Client {

    logger = createLogger("%c[Client]", "color: #a02d2a;");
    commands: Collection<string, Command>;
    slashCommands: Collection<string, SlashCommand>;
    cooldowns = new Collection<string, number>()
    config: ConfigManager;
    player: Player

    constructor() {
        super({
            intents:[
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
                        type: getType("WATCHING")
                    }
                ],
                status: PresenceUpdateStatus.Online,
            }
        });
        
        this.commands = new Collection()
        this.slashCommands = new Collection();
        this.cooldowns = new Collection();
        this.config = new ConfigManager();
        this.player = new Player(this);
        this.player.extractors.loadDefault();
    }
    
    async start() {
        this.login(this.config.getConfig().token.toString()).catch((error) => {
            this.logger.error("An error occurred while logging in: " + error);
        });

        const handlersDir = path.join(__dirname, "../handlers")

        fs.readdirSync(handlersDir).forEach(async (file) => {
            if (!file.endsWith(".ts")) return;
            const HandlerClass = (await import(`${handlersDir}/${file}`)).default;
            new HandlerClass(this);
        });

        return this
    }

    getClient() {
        return this;
    }
}
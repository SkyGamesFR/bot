import DiscordClient from "@/client/client";
import ConfigManager from "@/config/config";
import Player from "@/db/models/player.model";
import { TextChannel } from "discord.js";
import { Request, Response } from "express";

export default class McController {
    private client: DiscordClient;
    private config: ConfigManager;

    constructor() {
        this.client = DiscordClient.getClient();
        this.config = new ConfigManager();
    }

    public getPlayers(req: Request, res: Response): void {
        res.json({ message: 'getPlayers' });
    }

    public createPlayer = async (req: Request, res: Response) => {
        console.log(req.body);
        const { username, deaths, uuid } = req.body;
        const player = await Player.create({ uuid, username, deaths });
        return player;
    };

    public deletePlayer(req: Request, res: Response): void {
        res.json({ message: 'deletePlayer' });
    }

    public playerDied(req: Request, res: Response): void {
        const { playerName, reason} = req.body;
        const channel = this.client.channels.cache.get(this.config.getConfig().mc.rouletteChannel) as TextChannel;
        channel.send(`Player **${playerName}** died because of ${reason}`);
        res.status(200).send('Notification sent to Discord');
    }
}
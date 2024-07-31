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
        const { username, uuid, deaths } = req.body;

        if (!username || !uuid) {
            return res.status(400).json({ error: 'username and uuid are required' });
        }

        try {
            const player = await Player.create({
                username: username,
                uuid: uuid,
                deaths: deaths
            });
            res.status(200).json(player);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create player' });
        }
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
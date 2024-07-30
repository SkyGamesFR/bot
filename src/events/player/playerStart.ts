import DiscordClient from '@/client/client';
import { Message } from 'discord.js';

export const playerStart = (client: DiscordClient, message: Message, query: string, track: any) => {
    const channel = message.channel; // queue.metadata is your "message" object
    channel.send(`🎶 | Started playing **${track.title}**`);
};

export default playerStart;

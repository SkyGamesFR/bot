import DiscordClient from '@/client/client';
import { Message } from 'discord.js';

export const searchCancel = (client: DiscordClient, message: Message, query: string, tracks: any[]) => {
    message.channel.send(`❌ - Vous n'avez pas fourni de réponse valide ... Veuillez renvoyer la commande !`);
};

export default searchCancel;

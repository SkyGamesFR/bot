import DiscordClient from '@/client/client';
import { getThemeColor } from '@/utils/utils';
import { EmbedBuilder, Message } from 'discord.js';

const sendSearchResults = (client: DiscordClient, message: Message, query: string, tracks: any[]) => {
    const embed = new EmbedBuilder()
        .setColor(getThemeColor('infoColor'))
        .setAuthor({ name: `Here are your search results for ${query}` })
        .setTimestamp(new Date())
        .setDescription(tracks.map((t, i) => `**${i + 1}** - ${t.title}`).join('\n'));

    message.channel.send({ embeds: [embed] });
};

export default sendSearchResults;

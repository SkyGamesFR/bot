import DiscordClient from "@/client/client";
import { BotEvent } from "../types";
import { EmbedBuilder, Events, GuildMember, Interaction, TextChannel } from "discord.js";
import { checkBotPermissions, getThemeColor } from "@/utils/utils";

export default class GuildMemberAdd implements BotEvent {
    name = Events.GuildMemberAdd;
    once = false;
    enable = true;

    execute(member: GuildMember) {
        const client = member.client as DiscordClient;

        try {
            const { guild } = member;
            const role = guild.roles.cache.find(role => role.id === client.config.getConfig().discord.guillMemberRoleId);

            if(role) {
                member.roles.add(role);
            }

            const channelId = client.config.getConfig().discord.guildWelcomeChannelId;
            const channel = member.guild.channels.cache.get(channelId) as TextChannel;
            const welcomeEmbed = new EmbedBuilder()
                .addFields(
                    {
                        name: "Welcome to the server!",
                        value: `Welcome to the server, ${member.user.username}!`,
                    }
                )
                .setColor(getThemeColor("successColor"))
                .setTimestamp();

            if(channelId == null) return;
            channel.send({ embeds: [welcomeEmbed] });
        } catch (error) {
            client.logger.error('Error executing guildMemberAdd event: ' + error);
        }
    
    }
}

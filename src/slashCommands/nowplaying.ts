import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, Permissions, PermissionsBitField } from "discord.js";
import { SlashCommand } from "../types";
import { getThemeColor } from "@/utils/utils";
import { usePlayer, useTimeline } from "discord-player";

export default class NowplayingCommand implements SlashCommand {
    enable = true;
    command = new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Shows the currently playing track");
    cooldown = 10;
    botPermissions = [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks];

    async execute(interaction: CommandInteraction): Promise<void> {
        try {
            if (!interaction.inCachedGuild()) return;

            await interaction.deferReply();
          
            const node = usePlayer(interaction.guildId)!;
            const timeline = useTimeline(interaction.guildId);
          
            // this will also verify if usePlayer's value is null
            if (!timeline?.track) {
              const embed = new EmbedBuilder()
                .setColor(getThemeColor('mainColor'))
                .setDescription('No music is currently playing!');
          
              interaction.editReply({ embeds: [embed] });
            }
          
            const { track, timestamp } = timeline;
          
            const embed = new EmbedBuilder()
                .setColor(getThemeColor('mainColor'))
                .setTimestamp()
                .addFields(
                    { name: "🎶 | Now Playing", value: `\`\`\`yml\n${track.title} | ${track.author}\`\`\`` },
                    { name: "⏰ | Timestamp", value: `\`\`\`yml\n${timestamp}\`\`\`` },
                );
          
            interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error executing ping command:', error);
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true // Only visible to the user who used the command
            });
        }
    }
}

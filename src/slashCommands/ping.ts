import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, Permissions, PermissionsBitField } from "discord.js";
import { SlashCommand } from "../types";
import { getThemeColor } from "@/utils/utils";

export default class PingCommand implements SlashCommand {
    enable = true;
    command = new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Shows the bot's ping");
    cooldown = 10;
    botPermissions = [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks];

    async execute(interaction: CommandInteraction): Promise<void> {
        try {
            console.log('Ping command executed');
            const ping = interaction.client.ws.ping;
            let state;
            if (ping > 500) state = "🔴";
            else if (ping > 200) state = "🟡";
            else state = "🟢";

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(getThemeColor('mainColor'))
                        .setTimestamp()
                        .addFields(
                            { name: "🏓 | Pong!", value: `\`\`\`yml\n${state} | ${ping}ms\`\`\`` },
                        )
                ]
            });
        } catch (error) {
            console.error('Error executing ping command:', error);
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true // Only visible to the user who used the command
            });
        }
    }
}

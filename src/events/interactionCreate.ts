import DiscordClient from "@/client/client";
import { BotEvent } from "../types";
import { EmbedBuilder, Events, Interaction } from "discord.js";
import { checkBotPermissions, getThemeColor } from "@/utils/utils";

export default class InteractionCreate implements BotEvent {
    name = Events.InteractionCreate;
    once = false;
    enable = true;

    execute(interaction: Interaction) {
      const client = interaction.client as DiscordClient;

        // Check if interaction is defined
        if (!interaction) {
            console.error("Interaction is undefined");
            return;
        }

        if (interaction.isChatInputCommand()) {
            const command = client.slashCommands.get(interaction.commandName);
            const cooldown = client.cooldowns.get(
                `${interaction.commandName}-${interaction.user.username}`
            );

            if (!command) return;

            if (command.cooldown && cooldown) {
                if (Date.now() < cooldown) {
                    interaction.reply(
                        `You have to wait ${Math.floor(
                            Math.abs(Date.now() - cooldown) / 1000
                        )} second(s) to use this command again.`
                    );
                    setTimeout(() => interaction.deleteReply(), 5000);
                    return;
                }
                client.cooldowns.set(
                    `${interaction.commandName}-${interaction.user.username}`,
                    Date.now() + command.cooldown * 1000
                );
                setTimeout(() => {
                    client.cooldowns.delete(
                        `${interaction.commandName}-${interaction.user.username}`
                    );
                }, command.cooldown * 1000);
            } else if (command.cooldown && !cooldown) {
                client.cooldowns.set(
                    `${interaction.commandName}-${interaction.user.username}`,
                    Date.now() + command.cooldown * 1000
                );
            }

            const neededBotPermissions = checkBotPermissions(interaction, command.botPermissions);
            if (neededBotPermissions !== null) {
                return interaction.reply({
                    content: `❌ | **Ops! I need these permissions: ${neededBotPermissions?.join(", ")} To be able to execute the command**`
                });
            }

            try {
                command.execute(interaction);
            } catch (e) {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(getThemeColor('mainColor'))
                            .setTimestamp()
                            .setDescription(`❌ | **Error Al Ejecutar El Comando**`)
                    ]
                });
                console.log(e);
                return;
            }
        } else if (interaction.isAutocomplete()) {
            const command = client.slashCommands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                if (!command.autocomplete) return;
                command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
            }
        }
    }
}

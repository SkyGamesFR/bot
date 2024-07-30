import DiscordClient from "@/client/client";
import { BotEvent } from "../types";
import { ChannelType, Message, EmbedBuilder, Events } from "discord.js";
import {
  checkBotPermissions,
  checkPermissions,
  getThemeColor,
  sendTimedMessage,
} from "@/utils/utils";

export default class MessageCreateEvent implements BotEvent {
  name = Events.MessageCreate;
  once = false;
  enable = true;

  execute(message: Message, client: DiscordClient) {
    client = message.client as DiscordClient;

    if (!message.member || message.member.user.bot) return;
    if (!message.guild) return;
    const prefix = "+";

    // check bot mention
    const mention = new RegExp(`^<@!?${message.guild.members.me?.id}>( |)$`);
    if (message.content.match(mention)) {
      const embed = new EmbedBuilder()
        .setColor(getThemeColor("mainColor"))
        .setDescription(`Hey My Prefix is: \`${prefix}\``);
      return message.reply({ embeds: [embed] });
    }

    if (!message.content.startsWith(prefix)) return;
    if (message.channel.type !== ChannelType.GuildText) return;

    let args = message.content.substring(prefix.length).split(" ");
    let command = client.commands.get(args[0]);

    if (!command) {
        command = client.commands.find(
            (cmd) => cmd.aliases && cmd.aliases.includes(args[0])
        );

        if (!command) return;
    }

    let cooldown = client.cooldowns.get(
        `${command?.name}-${message.member.user.username}` || null
    );
    
    let neededPermissions = checkPermissions(
      message.member,
      command.permissions
    );
    if (neededPermissions !== null)
      return sendTimedMessage(
        `❌ | **Ops! I need these permissions: ${neededPermissions.join(
          ", "
        )} To be able to execute the command**`,
        message.channel,
        5000
      );

    let neededBotPermissions = checkBotPermissions(
      message,
      command.botPermissions
    );
    if (neededBotPermissions !== null) {
      return message.reply({
        content: `❌ | **Ops! I need these permissions: ${neededBotPermissions?.join(
          ", "
        )} To be able to execute the command**`,
      });
    }

    if (command.cooldown && cooldown) {
      if (Date.now() < cooldown) {
        sendTimedMessage(
          `You have to wait ${Math.floor(
            Math.abs(Date.now() - cooldown) / 1000
          )} second(s) to use this command again.`,
          message.channel,
          5000
        );
        return;
      }
      client.cooldowns.set(
        `${command.name}-${message.member.user.username}`,
        Date.now() + command.cooldown * 1000
      );
      setTimeout(() => {
        client.cooldowns.delete(
          `${command?.name}-${message.member?.user.username}`
        );
      }, command.cooldown * 1000);
    } else if (command.cooldown && !cooldown) {
      client.cooldowns.set(
        `${command.name}-${message.member.user.username}`,
        Date.now() + command.cooldown * 1000
      );
    }

    try {
      command.execute(message, args, client);
    } catch (e) {
      console.log(e);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(getThemeColor("mainColor"))
            .setTimestamp()
            .setDescription(`❌ | **Error Al Ejecutar El Comando`),
        ],
      });
    }
  }
}

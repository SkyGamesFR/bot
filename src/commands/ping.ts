import {
    EmbedBuilder,
    Message,
    PermissionResolvable,
  } from "discord.js";
  import { Command, SlashCommand } from "../types";
import { getThemeColor } from "@/utils/utils";
  
export default class PingCommand implements Command {
    enable = true;
    name = "ping";
    permissions: PermissionResolvable[] = ['SendMessages', 'ViewChannel'];
    botPermissions: PermissionResolvable[] = ['SendMessages', 'EmbedLinks'];
    aliases: ['pong'];

    async execute(message: Message, args: string[]) {
      const ping = message.client.ws.ping;
      let state;
      if (ping > 500) state = "🔴";
      else if (ping > 200) state = "🟡";
      else state = "🟢";
  
      await message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(getThemeColor('mainColor'))
            .setTimestamp()
            .addFields(
              { name: "🏓 | Pong!", value: `\`\`\`yml\n${state} | ${ping}ms\`\`\`` },
            )
        ]
      });
    }
}

import {
    SlashCommandBuilder,
    CommandInteraction,
    PermissionResolvable,
  } from "discord.js";
  import { SlashCommand } from "../types";
import { useMainPlayer } from "discord-player";
import { getVoiceConnection } from "@discordjs/voice";
  
export default class PingCommand implements SlashCommand {
    enable = true;
    command = new SlashCommandBuilder()
      .setName("play")
      .setDescription("play a song")
      .addStringOption(option =>
        option.setName('query')
          .setDescription('The song you want to play')
          .setRequired(true)
      );
    cooldown = 10;
    botPermissions: PermissionResolvable[] = ['SendMessages', 'EmbedLinks', 'Connect', 'Speak'];

    async execute(interaction: CommandInteraction): Promise<void> {
      const player = useMainPlayer(); // Get the player instance that we created earlier
      const voiceConnection = getVoiceConnection(interaction.guildId); 
      const guild = interaction.client.guilds.cache.get(interaction.guild.id)
      const member = guild.members.cache.get(interaction.member.user.id);
      const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
      interaction.reply('You are not connected to a voice channel!'); // make sure we have a voice channel
      return;
    }
      const query = interaction.options.get('query')?.value as string; // get the query from the user
  
      // let's defer the interaction as things can take time to process
      await interaction.deferReply();
      const searchResult = await player.search(query, { requestedBy: interaction.user });
  
      if (!searchResult.hasTracks()) {
          // If player didn't find any songs for this query
          await interaction.editReply(`We found no tracks for ${query}!`);
          return;
      } else {
          try {
              await player.play(voiceChannel, searchResult, {
                  nodeOptions: {
                      metadata: interaction // we can access this metadata object using queue.metadata later on
                  }
              });
              await interaction.editReply(`Loading your track`);
          } catch (e) {
              interaction.followUp(`Something went wrong: ${e}`);
          }
      }
    }
}

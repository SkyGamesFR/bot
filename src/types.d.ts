import {
  SlashCommandBuilder,
  CommandInteraction,
  Collection,
  PermissionResolvable,
  Message,
  AutocompleteInteraction,
  Events,
} from "discord.js";
import mongoose from "mongoose";
import DiscordClient from "./client/client";

export interface SlashCommand {
  enable: boolean;
  command: SlashCommandBuilder | any;
  execute: (interaction: CommandInteraction) => void;
  autocomplete?: (interaction: AutocompleteInteraction) => void;
  cooldown?: number; // in seconds
  botPermissions: Array<PermissionResolvable>;
}

export interface Command {
  name: string;
  enable: boolean;
  execute: (message: Message, args: Array<string>, client: DiscordClient) => void;
  permissions: Array<PermissionResolvable>;
  botPermissions: Array<PermissionResolvable>;
  aliases: Array<string>;
  cooldown?: number;
}

interface GuildOptions {
  prefix: string;
}

export interface IGuild extends mongoose.Document {
  guildID: string;
  options: GuildOptions;
  joinedAt: Date;
}

export type GuildOption = keyof GuildOptions;

export interface BotEvent {
  name: Events | GuildQueueEvent;
  once: boolean;
  type?: string;
  enable: boolean;
  execute(...args: any[]): void;
}

declare module "discord.js" {
  export interface DiscordClient {
    slashCommands: Collection<string, SlashCommand>;
    commands: Collection<string, Command>;
    cooldowns: Collection<string, number>;
    config: ConfigManager;
    player: Player;
  }
}
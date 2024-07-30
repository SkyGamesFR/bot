import { REST } from '@discordjs/rest';
import { readdir } from 'fs/promises'; // Using async fs methods
import { readdirSync } from 'fs';
import { join } from 'path';
import { Routes, SlashCommandBuilder } from 'discord.js';
import { Command, SlashCommand } from '../types.d';
import DiscordClient from '@/client/client';
import createLogger from '@/utils/logger';

class CommandLoader {
  private client: DiscordClient;
  private slashCommands: SlashCommandBuilder[] = [];
  private commands: Command[] = [];
  private slashCommandsDir: string;
  private commandsDir: string;
  private logger = createLogger('%c[CommandLoader]', 'color: #a02d2a;');

  constructor(client: DiscordClient) {
    this.client = client;
    this.slashCommandsDir = join(__dirname, '../slashCommands');
    this.commandsDir = join(__dirname, '../commands');

    this.loadSlashCommands();
    this.loadCommands();
    this.registerCommands();
  }

  private async loadSlashCommands(): Promise<void> {
    try {
      const files = readdirSync(this.slashCommandsDir);
      for (const file of files) {
        if (!file.endsWith('.ts')) continue;

        const CommandClass = require(`${this.slashCommandsDir}/${file}`).default;
        if (!CommandClass) {
          throw new Error(`Module ${file} does not have a default export.`);
        }
        const command: SlashCommand = new CommandClass(this.client);
        if (!command.enable) continue;
        this.slashCommands.push(command.command);
        this.client.slashCommands.set(command.command.name, command);
      }
    } catch (error) {
      console.error('Error loading slash commands:', error);
    }
  }

  private async loadCommands(): Promise<void> {
    try {
      const files = readdirSync(this.commandsDir);
      for (const file of files) {
        if (!file.endsWith('.ts')) continue;
        const CommandClass = require(`${this.commandsDir}/${file}`).default;
        if (!CommandClass) {
          throw new Error(`Module ${file} does not have a default export.`);
        }
        const command: Command = new CommandClass(this.client);
        if (!command.enable) continue;
        this.commands.push(command);
        this.client.commands.set(command.name, command);
      }
    } catch (error) {
      console.error('Error loading commands:', error);
    }
  }

  private async registerCommands(): Promise<void> {
    const rest = new REST({ version: '10' }).setToken(this.client.config.get('token'));
  
    try {
      const commandsData = this.slashCommands.map((command) => command.toJSON());  
      await rest.put(
        Routes.applicationCommands(this.client.config.get('clientId')),
        { body: commandsData },
      );

      this.logger.log(`[✅] Successfully registered ${this.slashCommands.length} SlashCommand(s)`);
  
      this.logger.log(`[✅] Successfully Loaded ${this.slashCommands.length} SlashCommand(s)`);
      this.logger.log(`[✅] Successfully Loaded ${this.commands.length} Command(s)`);
    } catch (error) {
      this.logger.error(`[❌] Error registering commands: ${error}`);
    }
  }
  
}

export default CommandLoader;

import { readdirSync } from "fs";
import { join } from "path";
import { BotEvent } from "@/types";
import DiscordClient from "@/client/client";
import createLogger from "@/utils/logger";
import { useMainPlayer } from "discord-player";

class EventLoader {
  private client: DiscordClient;
  private eventsDir: string;
  private logger = createLogger('%c[EventLoader]', 'color: #a02d2a;');
  private player = useMainPlayer();
  private eventsCount = 0;

  constructor(client: DiscordClient) {
    this.client = client;
    this.eventsDir = join(__dirname, "../events");
    this.loadEvents();
  }

  private loadEvents(): void {
    readdirSync(this.eventsDir).forEach((file) => {
      if (!file.endsWith(".ts")) return;
      try {
        const EventClass = require(`${this.eventsDir}/${file}`).default;
        if (!EventClass) {
          throw new Error(`Module ${file} does not have a default export.`);
        }

        const event: BotEvent = new EventClass(...[this.client]);

        this.logger.debug(`Imported event: ${event.name}`);
        this.logger.debug(`${event.name} event loaded with ${event.once ? "once" : "on"} listener ${event.enable ? "enabled" : "disabled"}`);

        if (!event.enable) return;

        if(event.type == "player") {
          this.player.events.on(event.name, (...args: any) => event.execute(...args));
          this.eventsCount+ 1;
        } else if (event.once) {
          this.client.once(event.name, (...args) => event.execute(...args));
          this.eventsCount+ 1;
        } else {
          this.client.on(event.name, (...args) => event.execute(...args));
          this.eventsCount+ 1;
        }
        
        this.logger.debug(`[🔧] Successfully loaded event ${event.name}`);
      } catch (error) {
        this.logger.error(`Failed to load event from file ${file}: ${error.message}`);
      }
    });

    this.logger.log(`[🔧] Successfully ${this.eventsCount} loaded event`);
  }
}

export default EventLoader;

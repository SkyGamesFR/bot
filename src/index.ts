import DiscordClient from './client/client'
import BotApi from './api/server'

new DiscordClient().start()
new BotApi().start()
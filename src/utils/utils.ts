import { ActivityType, GuildMember, PermissionFlagsBits, PermissionResolvable, TextChannel } from "discord.js";

export const getType = (type: ActivityType | String) => {
    switch (type) {
      case "COMPETING":
        return ActivityType.Competing;

      case "LISTENING":
        return ActivityType.Listening;

      case "PLAYING":
        return ActivityType.Playing;

      case "WATCHING":
        return ActivityType.Watching;

      case "STREAMING":
        return ActivityType.Streaming;
    }
};

export const getThemeColor = (color: string) => {
    switch (color) {
      case "mainColor":
        return "#2f3136";

      case "successColor":
        return "#43b581";

      case "errorColor":
        return "#f04747";

      case "warningColor":
        return "#faa61a";

      case "infoColor":
        return "#7289da";
    }
};

export const checkPermissions = (member: GuildMember, permissions: PermissionResolvable[]) => {
  if (!Array.isArray(permissions)) {
    throw new TypeError('permissions must be an array');
  }

  let neededPermissions: PermissionResolvable[] = [];
  permissions.forEach(permission => {
      if (!member.permissions.has(permission)) neededPermissions.push(permission);
  });

  if (neededPermissions.length === 0) return null;

  return neededPermissions.map(p => {
      if (typeof p === "string") return `\`${p.split(/(?=[A-Z])/).join(" ")}\``;
      else return Object.keys(PermissionFlagsBits).find(k => Object(PermissionFlagsBits)[k] === p)?.split(/(?=[A-Z])/).join(" ");
  });
};


export const checkBotPermissions = (message: any , permissions: PermissionResolvable[]) => {
  if(!message.channel?.permissionsFor(message.guild?.members.me).has('SendMessages')) return;
  let neededPermissions: PermissionResolvable[] = []
  permissions.forEach(permission => {
      if (!message.guild?.members.me?.permissions.has(permissions)) neededPermissions.push(permission)
  })
  if (neededPermissions.length === 0) return null;
  return neededPermissions.map(p => {
      if (typeof p === "string") return `\`${p.split(/(?=[A-Z])/).join(" ")}\``
      else return Object.keys(PermissionFlagsBits).find(k => Object(PermissionFlagsBits)[k] === p)?.split(/(?=[A-Z])/).join(" ")
  })
  
}

export const sendTimedMessage = (message: string, channel: TextChannel, duration: number) => {
  channel.send(message)
      .then(m => setTimeout(async () => (await channel.messages.fetch(m)).delete(), duration))
  return
}

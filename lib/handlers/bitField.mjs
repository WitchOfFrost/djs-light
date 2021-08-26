const loginIntentsArray = ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INTEGRATIONS", "GUILD_WEBHOOKS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_PRESENCE", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGE_TYPING", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING"]

export function loginIntents(wantedIntents) {
    return new Promise((resolve, reject) => {
        let calc = 0;

        wantedIntents.forEach(element => {
            if (loginIntentsArray.includes(element)) {
                calc = calc + (1 << loginIntentsArray.indexOf(element))
            };
        });

        resolve(calc);
    });
}

const { Client, Collection, EmbedBuilder, GatewayIntentBits, Partials, WebhookClient, codeBlock } = require("discord.js");
const User = require('./models/User.js');
const Handler = require("./handlers/handler");
const Topgg = require('@top-gg/sdk')

const client = new Client({ 
    intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessageTyping,
            ],
            partials: [
                Partials.Channel,
                Partials.Message,
                Partials.User,
                Partials.GuildMember,
                Partials.Reaction
            ]
})
module.exports = client;

client.config = require("./config.json");
client.topgg = new Topgg.Api(client.config.TopggToken);
client.commands = new Collection();
client.context = new Collection();
client.setMaxListeners(0);
client.color = "#1ABC9C";
client.database = { user: User };
client.discord = require('discord.js');
Handler(client)

client.kFormatter = function(n) {
  if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
};
client.addSuffix = function(number) {
    if (number % 100 >= 11 && number % 100 <= 13)
    return number + "th";

    switch (number % 10) {
        case 1: return number + "st";
        case 2: return number + "nd";
        case 3: return number + "rd";
    }
    return number + "th";
}



client.login(client.config.token).catch((err) => {
    console.error("An error has occurred:", err)
    return process.exit();
})

process.on('unhandledRejection', async (reason, promise) => {
    console.log("unhandled rejection at:", promise, 'reason:', reason)
});

process.on('uncaughtException', (err) => {
    console.log("Uncaught Exception:", err);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log("Uncaught Exception Monitor:", err, origin);
});

process.on('rejectionHandled', (err) => {
    console.log("rejected handled:", err);
})

process.on('warning', (warning) => {
    console.log("Warning:", warning);
})
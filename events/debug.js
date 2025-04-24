const client = require("../index.js")
const channel = new client.discord.WebhookClient({ url: "https://discord.com/api/webhooks/1315138070881767514/ivFRljk78sFeJIYOWoixS4sJqYIP-oRaeW6regJVj1qIHwTLiru639PtyMqdvu1LviSG" });
client.on(client.discord.Events.Debug, async (info) => {
channel.send({ 
username: 'Debugs Logs', 
avatarURL: "https://discoria.xyz/image/discoria.png",
embeds: [new client.discord.EmbedBuilder()
.setDescription(info)
.setColor(client.color)
]}).catch(() => {});
});
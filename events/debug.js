const client = require("../index.js")
const channel = new client.discord.WebhookClient({ url: "" });
client.on(client.discord.Events.Debug, async (info) => {
channel.send({ 
username: 'Debugs Logs', 
avatarURL: client.user.displayAvatarURL({ dynamic: true }),
embeds: [new client.discord.EmbedBuilder()
.setDescription(info)
.setColor(client.color)
]}).catch(() => {});
});

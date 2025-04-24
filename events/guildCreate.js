const client = require("../index.js")
const channel = new client.discord.WebhookClient({ url: "https://discord.com/api/webhooks/1315129318854234192/-Dh9lnYzcXHOrSM1tnwsMJC3_i00AzzGIFSI1p6Z7Qqoi6n0YRGQ_XojKir90uZpo0W-" });
client.on(client.discord.Events.GuildCreate, async (Guild) => {
if (!Guild?.available) return;
const owner = await client.users.fetch(Guild.ownerId);
     let embed = new client.discord.EmbedBuilder()
      .setAuthor({name: "Added to a new server!", iconURL: owner?.displayAvatarURL({ dynamic: true }) })
       .addFields([
            { name: "Name", value: `\`${Guild.name}\``},
            { name: "ID", value: `\`${Guild.id}\``},
            { name: "Owner", value: `\`${owner?.username} (${owner?.id})\``},
            { name: `Creation Date`, value: `<t:${(Guild.createdTimestamp / 1000).toString().split('.')[0]}> (<t:${(Guild.createdTimestamp / 1000).toString().split('.')[0]}:R>)` },
            { name: "Member Count", value: `\`${client.kFormatter(Guild.memberCount)} Members\``},
          ])     
        .setTimestamp()
       .setColor("Green")
    if (Guild.iconURL()) {
        embed.setThumbnail(Guild.iconURL({dynamic: true, size: 1024 }));
    } else {
        embed.setThumbnail(client.user.displayAvatarURL({ size: 1024 }));
    }
  channel.send({ username: 'Guilds Logs', avatarURL: 'https://discoria.xyz/image/discoria.png', embeds: [embed] }).catch(() => {});
})

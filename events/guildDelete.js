const client = require("../index.js")
const webhookClient = new client.discord.WebhookClient({ url: "https://discord.com/api/webhooks/1315129318854234192/-Dh9lnYzcXHOrSM1tnwsMJC3_i00AzzGIFSI1p6Z7Qqoi6n0YRGQ_XojKir90uZpo0W-" });
const welcome = require("../models/welcome");
const leave = require("../models/leave");
const auto = require("../models/autorole");
const boost = require("../models/boost");
const birthdays = require("../models/birthdaychannels");

client.on(client.discord.Events.GuildDelete, async (guild) => {
 if (!guild?.available) return;
 await welcome.findOneAndDelete({ Guild: guild.id })
 await leave.findOneAndDelete({ Guild: guild.id })
 await auto.findOneAndDelete({ Guild: guild.id })
 await boost.findOneAndDelete({ Guild: guild.id })
 await birthdays.findOneAndDelete({ Guild: guild.id })
 
const owner = await client.users.fetch(guild.ownerId);
 let embed = new client.discord.EmbedBuilder()
     .setAuthor({ name: "Removed from a server!", iconURL: owner?.displayAvatarURL({ dynamic: true }) })
     .setColor("Red")
     .setTimestamp()
      .addFields([
            { name: "Name", value: `\`${guild.name}\``},
            { name: "ID", value: `\`${guild.id}\``},
            { name: "Owner", value: `\`${owner?.username} (${owner?.id})\``},
            { name: `Creation Date`, value: `<t:${(guild.createdTimestamp / 1000).toString().split('.')[0]}> (<t:${(guild.createdTimestamp / 1000).toString().split('.')[0]}:R>)` },
            { name: "Member Count", value: `\`${client.kFormatter(guild.memberCount)} Members\``},
        ])    
       if (guild.iconURL()) {
        embed.setThumbnail(guild.iconURL({dynamic: true, size: 1024 }));
    } else {
        embed.setThumbnail(client.user.displayAvatarURL({ size: 1024 }));
    }
 webhookClient.send({ username: 'Guilds Logs', avatarURL: 'https://discoria.xyz/image/discoria.png', embeds: [embed] }).catch(() => {});
})

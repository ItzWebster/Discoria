const boost = require("../models/boost");
const client = require("../index.js")
client.on(client.discord.Events.GuildMemberUpdate, (oldMember, newMember) => {
boost.findOne({ Guild: newMember.guild.id }, async (e, data) => {
if (!data) return;
if (!oldMember.premiumSince && newMember.premiumSince) {
    const channel = newMember.guild.channels.cache.get(data.Channel)
        if(!channel) return;
        channel.send({ embeds: [new client.discord.EmbedBuilder()
          .setColor("#f47fff")
          .setDescription(`${newMember.user} has boosted the server.`)]
        }).catch(err => {})   
   }
 })
})
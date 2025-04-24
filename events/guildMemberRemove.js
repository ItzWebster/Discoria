const leave = require("../models/leave");
const client = require("../index.js")
const birthdays = require("../models/birthdays");

client.on(client.discord.Events.GuildMemberRemove, async (member) => {
await birthdays.findOneAndDelete({ Guild: member.guild.id, User: member.user.id })
leave.findOne({ Guild: member.guild.id }, async (e, data) => {
 if (!data) return;
    const channel = member.guild.channels.cache.get(data.Channel)
    if(!channel) return;
    channel.send({content: `${member.user.tag} left the server.`}).catch(err => {})
  })
})
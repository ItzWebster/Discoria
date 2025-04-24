const client = require("../index.js")
const Schema = require("../models/birthdays");
const birthdayChannel = require("../models/birthdaychannels");
const dbl = require('discordbotlist');
const { CronJob } = require('cron');



client.once(client.discord.Events.ClientReady, async () => {
console.log(`Logged in as ${client.user.displayName} on Shard ${client.shard.ids}.`); 
client.handleCommands(client)
client.dbl = dbl.createDjsClient(client.config.dbl, client);
checkBirthdays()
})

async function checkBirthdays() {
    const now = new Date();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    const months = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December"
    };
    const convertedDay = suffixes(day);
    const convertedMonth = months[month];
    const birthdayString = `${convertedDay} of ${convertedMonth}`;
    const rawBirthdayboard = await Schema.find({ Birthday: birthdayString })
    if (rawBirthdayboard) {
        await Promise.all(rawBirthdayboard.map(async (data) => { 
            const guild = client.guilds.cache.get(data.Guild);
            const member = await guild.members.fetch(data.User).catch(err => { });
            if (!member) return Schema.findOneAndDelete({ Guild: guild.id, User: member.id });
            if (guild) {
                birthdayChannel.findOne({ Guild: guild.id }, async (err, data) => {
                    if (data) {
                        const channel = guild.channels.cache.get(data.Channel);
                        return channel.send({embeds: [new client.discord.EmbedBuilder()
                        .setDescription(`🥳 HAPPY BIRTHDAY TO ${member} 🥳`)
                        .setAuthor({ name: member.nickname ? member.nickname : member.displayName, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
                        .setColor(client.color)
                        ]}).then(async sentMsg => {
                          const reactions = ['🎉', '🎂', '🥳', '🎊', '🎈'];
                            for (const emoji of reactions) {
                              await sentMsg.react(emoji);
                        }}).catch(e => {})
                    } 
                })
            }
        }));
}
new CronJob('00 00 00 * * *', function () {
checkBirthdays()  
}, true, true);
}

function suffixes(number) {
  const converted = number.toString();
  
  const lastChar = converted.charAt(converted.length - 1);
  
  return lastChar == "1" ?
    `${converted}st` : lastChar == "2" ?
        `${converted}nd` : lastChar == '3'
            ? `${converted}rd` : `${converted}th`
}
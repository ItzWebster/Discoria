const { EmbedBuilder, time, ButtonBuilder, ActionRowBuilder, ButtonStyle, ActivityType, ApplicationCommandType, MessageFlags } = require("discord.js");
const cm = ["661200758510977084", "873368320756318229", "921675266898657291"];
const mods = [];
const team = ["1315220693691924510"];
const blacklist = require("../../models/blacklist"); 

module.exports = {
  name: "User Info",
  type: ApplicationCommandType.User,
 run: async (client, interaction) => {  
     const user = await interaction.guild.members.fetch(interaction.targetId).catch(err => { });
if(!user) return interaction.reply({embeds: [new EmbedBuilder().setTitle("Member not found").setColor(client.color)], flags: MessageFlags.Ephemeral })
let topRoles =  user.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(role => role).filter((z) => z.name !== "@everyone")
        .slice(0, 10);
       const blacklistUser = await blacklist.findOne({ ID: user.user.id })
     const userFlags = await user.user.flags.toArray();
     const createdAt = `<t:${(user.user.createdTimestamp / 1000).toString().split('.')[0]}> (<t:${(user.user.createdTimestamp / 1000).toString().split('.')[0]}:R>)`
     const joinedAt = time (user.joinedAt, "R");
    const embed = new EmbedBuilder()
    .setTitle(`Who is ${user.nickname ? user.nickname : user.displayName}?`)
    .setColor(client.color)
    .addFields({ name: '__**User Info:**__', value: `
      **Display Name:** ${user.user.displayName}
      **Username:** ${user.user.tag}
      **ID:** ${user.user.id}
      **Bot:** ${user.user.bot ? "Yes" : "No"}
      **Created:** ${createdAt}
      **Badges:** ${addBadges(userFlags).join("")}`})
    .addFields({ name: '__**Server Member:**__', 
    value:`
      **Joined:** ${joinedAt}
      **Nickname:** ${user.nickname ? user.nickname : user.displayName}
      **Highest Role:** ${user.roles.highest.id === interaction.guild.id ? "No Highest Role." : user.roles.highest}`})
      .addFields({ name: '__**Roles:**__', value: `${topRoles.join(', ').replace(`<@${interaction.guildId}>`)}` })
      .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
   if(blacklistUser) { 
     embed.addFields({ name: "__**Additionally:**__", value: `This user is blacklisted from using **${client.user.displayName}**!`})
    } else {
    if (client.config.owners.includes(user.user.id)) {
    embed.addFields({ name: "__**Additionally:**__", value: `This user is an Developer of **${client.user.displayName}**!`})
   }
   if (cm.includes(user.user.id)) {
    embed.addFields({ name: "__**Additionally:**__", value: `This user is an Community Managers of **${client.user.displayName}**!`})
   }
   if (mods.includes(user.user.id)) {
    embed.addFields({ name: "__**Additionally:**__", value: `This user is an Moderator of **${client.user.displayName}**!`})
   }
   if (team.includes(user.user.id)) {
    embed.addFields({ name: "__**Additionally:**__", value: `This user is an Official Support Team of **${client.user.displayName}**!`})
   } 
  }
   interaction.reply({ embeds: [embed] });
   },
}


function addBadges(badgeNames) {
   if (!badgeNames.length) return ["None"];
    const badgeMap = {
        ActiveDeveloper: "<:activedev:1315493472039604274> ",
        BugHunterLevel1: "<:bughunter:1315492087583608862>",
        BugHunterLevel2: "<:bughunter1:1315492209298112538>",
        PremiumEarlySupporter: "<:early:1315492326130581615>",
        Partner: "<:partner:1315492479490854972>",
        Staff: "<:staff:1315492580158472213>",
        HypeSquadOnlineHouse1: "<:bravery:1315491377965961257>", 
        HypeSquadOnlineHouse2: "<:brilliance:1315491248462630952>", 
        HypeSquadOnlineHouse3: "<:balance:1315491841264844823>",  
        Hypesquad: "<:hypersquad:1315491776324177990>",
        CertifiedModerator: "<:Certified_Moderator:1315492953933746338>",
        VerifiedDeveloper: "<:verifieddev:1315493485691797524>",
        VerifiedBot: "<:verified:1315493239737946252>",
    };
    return badgeNames.map(badgeName => badgeMap[badgeName] || 'Unknown');
}
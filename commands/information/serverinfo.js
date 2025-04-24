const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
const verificationLevelObj = {
            0: 'None',
            1: 'Low',
            2: 'Medium',
            3: 'High',
            4: 'Very high'
        }; 

module.exports = {
name: 'serverinfo',
description: 'Get the server information.',
type: ApplicationCommandType.ChatInput,
run: async (client, interaction) => {
   const guild = await interaction.guild;
   const owner = await guild.members.fetch(guild.ownerId);
             const embed = new EmbedBuilder()
                    .setTitle(`Server info: ${guild.name}`)
                    .addFields(
                        {
                            name: 'Guild ID',
                            value: `\`${guild.id}\``,
                            inline: false
                        },
                        {
                            name: 'Server owner',
                            value: `${guild == "1315121712865607752" ? `\`${client.user.tag} (${client?.user.id})\`` : `\`${owner?.user.tag} (${owner?.user.id})\``}`,
                            inline: false
                        },
                         {
                            name: 'Created at',
                            value: `<t:${(guild.createdTimestamp / 1000).toString().split('.')[0]}> (<t:${(guild.createdTimestamp / 1000).toString().split('.')[0]}:R>)`,
                            inline: false
                        },
                        {
                            name: 'Verification level',
                            value: `\`${verificationLevelObj[guild.verificationLevel]}\``,
                            inline: false
                        },
                        {
                            name: 'Member Count',
                            value: `\`${client.kFormatter(guild.memberCount)} Members\``,
                            inline: false
                        },
                        {
                            name: 'Channel Count',
                            value: `\`${client.kFormatter(guild.channels.cache.size)} Channels\``,
                            inline: false
                        },
                        {
                            name: 'Boosts Count',
                            value: `\`${client.kFormatter(guild.premiumSubscriptionCount)} Boosters\``,
                            inline: false
                        },
                        {
                            name: 'Emoji Count',
                            value: `\`${client.kFormatter(guild.emojis.cache.size)} Emojis\``,
                            inline: false
                        }
                    )
                    .setColor(client.color)
          if (guild.iconURL()) {
             embed.setThumbnail(guild.iconURL({dynamic: true, size: 1024 }));
           } else {
            embed.setThumbnail(client.user.displayAvatarURL({ size: 1024 }));
          }
       return interaction.reply({embeds: [embed]})
    }
};
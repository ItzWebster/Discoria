const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
module.exports = {
name: 'membercount',
description: 'Get the member count of the server.',
type: ApplicationCommandType.ChatInput,
run: async (client, interaction) => {
  interaction.reply({ embeds: [new EmbedBuilder()
  .setColor(client.color)
  .setDescription(`**${interaction.guild.name}** has ${interaction.guild.memberCount} members!`)
 ]})
 }
}

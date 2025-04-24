const { ApplicationCommandType, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')

module.exports = {
  name: "invite",
  category: "Information",
  description: "feel free to invite me or join my support server",
  type: ApplicationCommandType.ChatInput,
  run: async(client, interaction) => {
    let buttons = new ActionRowBuilder().addComponents([
      new client.discord.ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel('vote me')
        .setURL(`https://top.gg/bot/${client.user.id}/vote`)
        .setDisabled(true),
        new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel('Support Server')
        .setURL(client.config.supportserver)    
      ]);

  interaction.reply({content: `https://discord.com/application-directory/${client.user.id}`, components: [buttons]})
  }
}
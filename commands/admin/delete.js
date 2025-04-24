const { ApplicationCommandType, ApplicationCommandOptionType, MessageFlags } = require('discord.js')
const welcome = require("../../models/welcome");
const leave = require("../../models/leave");
const auto = require("../../models/autorole");
const boost = require("../../models/boost");
const birthdaychannels = require("../../models/birthdaychannels");

module.exports = {
    name: "delete",
    description: "Delete the server setup",
    type: ApplicationCommandType.ChatInput,
    userprems : ["Administrator"],
    options: [
        {
            name: "welcome",
            description: "Delete the welcome setup",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "leave",
            description: "Delete the leave setup",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "autorole",
            description: "Delete the welcome role setup",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "boost",
            description: "Delete the boost setup",
            type: ApplicationCommandOptionType.Subcommand,
        },
         {
            name: "birthdays",
            description: "Delete the birthdays setup",
            type: ApplicationCommandOptionType.Subcommand,
        }, 

    ],
run: async(client, interaction) => {
        if (interaction.options.getSubcommand() === "welcome") {
          welcome.findOne({ Guild: interaction.guild.id }, async(err, data) => {
            if(!data) return interaction.reply({ content: "Welcome isn't setup.", flags: MessageFlags.Ephemeral });
             await welcome.findOneAndDelete({ Guild: interaction.guild.id}).then(() => {
             interaction.reply({ content: "Welcome successfully deleted.", flags: MessageFlags.Ephemeral })
           })
          })
    } else if (interaction.options.getSubcommand() === "leave") {
      leave.findOne({ Guild: interaction.guild.id }, async(err, data) => {
        if(!data) return interaction.reply({content: "Leave isn't setup.", flags: MessageFlags.Ephemeral });
         await leave.findOneAndDelete({ Guild: interaction.guild.id }).then(() => {
         interaction.reply({ content: "leave successfully deleted.", flags: MessageFlags.Ephemeral })
       })
      })
        } else if (interaction.options.getSubcommand() === "autorole") {
          auto.findOne({ Guild: interaction.guild.id }, async(err, data) => {
            if(!data) return interaction.reply({ content: "Welcome Role isn't setup.", flags: MessageFlags.Ephemeral });
             await auto.findOneAndDelete({ Guild: interaction.guild.id }).then(() => {
             interaction.reply({ content: "AutoRole successfully deleted.", flags: MessageFlags.Ephemeral })
           })
          })
       } else if (interaction.options.getSubcommand() === "boost") {
          boost.findOne({ Guild: interaction.guild.id }, async(err, data) => {
            if(!data) return interaction.reply({ content: "Boost isn't setup.", flags: MessageFlags.Ephemeral });
             await boost.findOneAndDelete({ Guild: interaction.guild.id}).then(() => {
             interaction.reply({ content: "Boost successfully deleted.", flags: MessageFlags.Ephemeral })
           })
          })
      } else if (interaction.options.getSubcommand() === "birthdays") {
          birthdaychannels.findOne({ Guild: interaction.guild.id }, async(err, data) => {
            if(!data) return interaction.reply({ content: "Birthdays isn't setup.", flags: MessageFlags.Ephemeral });
             await birthdaychannels.findOneAndDelete({ Guild: interaction.guild.id}).then(() => {
            interaction.reply({ content: "Birthdays successfully deleted.", flags: MessageFlags.Ephemeral })
           })
          })
      }

  }
}
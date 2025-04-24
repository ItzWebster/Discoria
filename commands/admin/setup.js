const { ApplicationCommandType, ApplicationCommandOptionType, ChannelType, MessageFlags } = require('discord.js')
const welcome = require("../../models/welcome");
const leave = require("../../models/leave");
const auto = require("../../models/autorole");
const boost = require("../../models/boost");
const birthdays = require("../../models/birthdaychannels");

module.exports = {
    name: "setup",
    description: "Manage the Discoria setups",
    type: ApplicationCommandType.ChatInput,
    userprems: ["Administrator"],
    options: [
        {
            name: "welcome",
            description: "Setup the welcome channels and messages",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "pick a channel",
                    required: true,
                    type: ApplicationCommandOptionType.Channel,
                    channel_types: [ChannelType.GuildText],
                }, 
                {
                    name: "messages",
                    description: "Example: Hi {mention}, welcome to {server}",
                    required: false,
                    type: ApplicationCommandOptionType.String,
                }
            ]
        },
        {
            name: "leave",
            description: "Setup the leave channels",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                  name: "channel",
                  description: "pick a channel",
                  required: true,
                  type: ApplicationCommandOptionType.Channel,
                  channel_types: [ChannelType.GuildText],
              }
          ]
        },
        {
            name: "autorole",
            description: "Setup the welcome role",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "role",
                    description: "pick a role",
                    required: true,
                    type: ApplicationCommandOptionType.Role,
                }
            ]
        }, 
         {
            name: "boost",
            description: "Setup the boost channels",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "pick a channel",
                    required: true,
                    type: ApplicationCommandOptionType.Channel,
                    channel_types: [ChannelType.GuildText],
                }
            ]
        },
        {
          name: "birthdays",
          description: "Setup the birthday channels",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
              {
                  name: "channel",
                  description: "pick a channel",
                  required: true,
                  type: ApplicationCommandOptionType.Channel,
                  channel_types: [ChannelType.GuildText],
              }
          ]
      },
  ],
run: async(client, interaction) => {
if (interaction.options.getSubcommand() === "welcome") {
    const channel = interaction.options.getChannel("channel");
    const message = interaction.options.getString("messages") || "Hi {mention}, welcome to **{server}**";
      welcome.findOne({ Guild: interaction.guild.id }, async (err, data) => {
       if (data) {
           data.Channel = channel.id;
           data.Message = message;
           data.save().then(() => {
              interaction.reply({content: `${channel} has been set up successfully for welcome messages!`, flags: MessageFlags.Ephemeral})
            })
        } else {
          new welcome({
              Guild: interaction.guild.id,
              Channel: channel.id,
              Message: message,
          }).save().then(() => {
              interaction.reply({content: `${channel} has been set up successfully for welcome messages!`, flags: MessageFlags.Ephemeral})
          })
        } 
      })
} else if (interaction.options.getSubcommand() === "leave") {
const channel = interaction.options.getChannel("channel")
      leave.findOne({ Guild: interaction.guild.id }, async (err, data) => {
        if (data) {
          data.Channel = channel.id;
          data.save().then(() => {
            interaction.reply({content: `${channel} has been set up successfully for leave messages!`, flags: MessageFlags.Ephemeral})
          })
        } else {
          new leave({
            Guild: interaction.guild.id,
            Channel: channel.id,
          }).save().then(() => {
            interaction.reply({content: `${channel} has been set up successfully for leave messages!`, flags: MessageFlags.Ephemeral})
          })
        } 
      })
} else if (interaction.options.getSubcommand() === "autorole") {
        const role = interaction.options.getRole("role")
        auto.findOne({ Guild: interaction.guild.id }, async (err, data) => {
          if (data) {
            data.Role = role.id;
            data.save().then(() => {
              interaction.reply({content: `${role} has been set up successfully for AutoRole!`, flags: MessageFlags.Ephemeral})
             })
          } else {
            new auto({
              Guild: interaction.guild.id,
              Role: role.id,
            }).save().then(() => {
              interaction.reply({content: `${role} has been set up successfully for AutoRole!`, flags: MessageFlags.Ephemeral})
         })
          } 
        })
      } else if (interaction.options.getSubcommand() === "boost") {
          const channel = interaction.options.getChannel("channel")
          boost.findOne({ Guild: interaction.guild.id }, async (err, data) => {
            if (data) {
              data.Channel = channel.id;
              data.save().then(() => {
                interaction.reply({content: `${channel} has been set up successfully for boost messages!`, flags: MessageFlags.Ephemeral})
              })
            } else {
              new boost({
                Guild: interaction.guild.id,
                Channel: channel.id,
              }).save().then(() => {
                interaction.reply({content: `${channel} has been set up successfully for boost messages!`, flags: MessageFlags.Ephemeral})
           })
            } 
          })
} else if (interaction.options.getSubcommand() === "birthdays") {
          const channel = interaction.options.getChannel("channel")
          birthdays.findOne({ Guild: interaction.guild.id }, async (err, data) => {
            if (data) {
              data.Channel = channel.id;
              data.save().then(() => {
                interaction.reply({content: `${channel} has been set up successfully for birthday messages!`, flags: MessageFlags.Ephemeral})   
            })
            } else {
              new birthdays({
                Guild: interaction.guild.id,
                Channel: channel.id,
              }).save().then(() => {
                interaction.reply({content: `${channel} has been set up successfully for birthday messages!`, flags: MessageFlags.Ephemeral})
            })
            } 
          })
        } 
 }
}
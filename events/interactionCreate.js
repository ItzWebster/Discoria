const blacklist = require("../models/blacklist"); 
const client = require("../index.js")
const prefix = "/"

client.on(client.discord.Events.InteractionCreate, async (interaction) => {
  if (!interaction.inGuild()) { 
    return interaction.reply({embeds: [new client.discord.EmbedBuilder()
         .setDescription(
          `Hey **${interaction.user.displayName}**, I don't currently support DM interactions. Please try again in a server.`)
         .setColor(client.color)
      ], flags: client.discord.MessageFlags.Ephemeral})
  } 
  if (interaction.isChatInputCommand()) {
    blacklist.findOne({ ID: interaction.user.id }, async(err, data) => {
      if(err) throw err;
      if(data) { 
        return interaction.reply({embeds: [new client.discord.EmbedBuilder()
          .setDescription(`Hey **${interaction.user.displayName}**, You are blacklisted from using ${client.user.displayName}.`)
            .setColor(client.color)
      ], flags: client.discord.MessageFlags.Ephemeral})
     } else {
    const command = client.commands.get(interaction.commandName);
  if (!interaction.member.permissions.has(command.userprems || [])) { 
    return interaction.reply({embeds: [new client.discord.EmbedBuilder()
         .setDescription(
          `Hey **${interaction.user.displayName}**, You are missing \`${new client.discord.PermissionsBitField(command.userprems).toArray().join("\`, \`")}\` permissions to use this command!`
        )
         .setColor(client.color)
      ], flags: client.discord.MessageFlags.Ephemeral})
  } 
  if (!interaction.guild.members.me.permissions.has(command.botprems || [])) {
    return interaction.reply({embeds: [new client.discord.EmbedBuilder()
        .setDescription(
          `Hey **${interaction.user.displayName}**, I am missing \`${new client.discord.PermissionsBitField(command.botprems).toArray().join("\`, \`")}\` permissions to use this command!`
        )
       .setColor(client.color)
     ], flags: client.discord.MessageFlags.Ephemeral})
}

if (command.ownerOnly) {
  if (!client.config.owners.includes(interaction.user.id)) {
    return interaction.reply({embeds: [new client.discord.EmbedBuilder()
      .setDescription(`Hey **${interaction.user.displayName}**, *Only ${client.user.displayName} Developer can use this command*`)
      .setColor(client.color)
      ], flags: client.discord.MessageFlags.Ephemeral})
  }
};
try {
   await command.run(client, interaction, prefix);
} catch (error) {
console.error(error);
if (interaction.replied || interaction.deferred) {
 await interaction.followUp({ embeds: [new client.discord.EmbedBuilder()
        .setDescription(`Hey **${interaction.user.displayName}**, An error occured while running this command! Error: ${error}`)
       .setColor(client.color)
     ], flags: client.discord.MessageFlags.Ephemeral });
} else {
 await interaction.reply({ embeds: [new client.discord.EmbedBuilder()
        .setDescription(`Hey **${interaction.user.displayName}**, An error occured while running this command! Error: ${error}`)
       .setColor(client.color)
     ], flags: client.discord.MessageFlags.Ephemeral });
  }
}     
}
})
} else if (interaction.isContextMenuCommand()){
  blacklist.findOne({ ID: interaction.user.id }, async(err, data) => {
    if(data) { 
      return interaction.reply({embeds: [new client.discord.EmbedBuilder()
         .setDescription(`Hey **${interaction.user.displayName}**, You are blacklisted from using ${client.user.displayName}.`)
         .setColor(client.color)
    ], flags: client.discord.MessageFlags.Ephemeral})
   } else {
    const command = client.context.get(interaction.commandName);
    if (!interaction.member.permissions.has(command.userprems || [])) { 
      return interaction.reply({embeds: [ new client.discord.EmbedBuilder()
           .setDescription(
            `Hey **${interaction.user.displayName}**, You are missing \`${new client.discord.PermissionsBitField(command.userprems).toArray().join("\`, \`")}\` permissions to use this command!`
          )
           .setColor(client.color)
        ], flags: client.discord.MessageFlags.Ephemeral})
    } 
    if (!interaction.guild.members.me.permissions.has(command.botprems || [])) {
      return interaction.reply({embeds: [ new client.discord.EmbedBuilder()
          .setDescription(
            `Hey **${interaction.user.displayName}**, I am missing \`${new client.discord.PermissionsBitField(command.botprems).toArray().join("\`, \`")}\` permissions to use this command!`
          )
         .setColor(client.color)
       ], flags: client.discord.MessageFlags.Ephemeral})
  }

    if (command.ownerOnly) {
        if (!client.config.owners.includes(interaction.user.id)) {
          return interaction.reply({embeds: [ new client.discord.EmbedBuilder()
            .setDescription(`Hey **${interaction.user.displayName}**, *Only ${client.user.displayName} Developer can use this command*`)
             .setColor(client.color)
            ], flags: client.discord.MessageFlags.Ephemeral })
        }
    }; 
  
try {
   await command.run(client, interaction, prefix);
} catch (error) {
console.error(error);
if (interaction.replied || interaction.deferred) {
 await interaction.followUp({ embeds: [new client.discord.EmbedBuilder()
        .setDescription(`Hey **${interaction.user.displayName}**, An error occured while running this command! Error: ${error}`)
       .setColor(client.color)
     ], flags: client.discord.MessageFlags.Ephemeral });
} else {
 await interaction.reply({ embeds: [new client.discord.EmbedBuilder()
        .setDescription(`Hey **${interaction.user.displayName}**, An error occured while running this command! Error: ${error}`)
       .setColor(client.color)
     ], flags: client.discord.MessageFlags.Ephemeral });
  }
}   }
})
}
})
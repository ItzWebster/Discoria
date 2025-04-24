const { EmbedBuilder, ApplicationCommandOptionType, ApplicationCommandType } = require("discord.js");

module.exports = {
 name: "clear",
 description: "Removes up to 100 messages",
 userprems: ["KickMembers", "BanMembers"],
 botprems: ["ManageMessages"],
 type: ApplicationCommandType.ChatInput,
 options: [
        {
            name: 'amount',
            description: 'pick a number to 1 to 100',
            type: ApplicationCommandOptionType.Number,
            required: true
        }
 ],
 category: "Moderation",
 usage: "clear <amount>",
 run: async (client, interaction, prefix) => {
    const amount = interaction.options.getNumber('amount');
   if (amount > 100) {
    return interaction.reply({ embeds: [new EmbedBuilder() 
     .setColor(client.color)
     .setDescription(`Insert the number smaller than \`100\`!\n\n**Usage:** \`${prefix} clear <amount>\``)
     ], flags: client.discord.MessageFlags.Ephemeral})
   }
   if (amount < 1) {
    return interaction.reply({ embeds: [new EmbedBuilder()
     .setColor(client.color)
     .setDescription(`Insert number greater than \`0\`!\n\n**Usage:** \`${prefix} clear <amount>\``)
     ], flags: client.discord.MessageFlags.Ephemeral })
   }
    const message_count = parseInt(amount); 
    await interaction.channel.messages.fetch({ limit: message_count }).then(async (fetched) => {
      await interaction.channel.bulkDelete(fetched).then(async (messages) => {
       const m = await interaction.reply({ embeds: [new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`Successfully deleted ${messages.size == 1 ? `**${messages.size}** message` : `**${messages.size}** messages`}`)
        ], withResponse: true})
        setTimeout(() => {
         if (m.resource.message.deletable) m.resource.message.delete();
        }, 10000)
      });
    }).catch(error => {
    return interaction.reply({content: "you can not delete message over 14 days old."})
   })
 },
};
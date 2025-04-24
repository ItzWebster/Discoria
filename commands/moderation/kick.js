const { EmbedBuilder, ApplicationCommandOptionType, ApplicationCommandType} = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kick a user.',
    userprems: ["KickMembers", "BanMembers"],
    botprems: ["KickMembers"],
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'user',
            description: 'pick a user.',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'reason',
            description: 'The reason for the kick.',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    run: async (client, interaction) => {
      const user = interaction.options.getMember('user');
      const reasonInput = interaction.options.getString('reason') || 'No reason was provided';

        if (!user) return interaction.reply({
            content: `The user is not in the guild.`,
            flags: client.discord.MessageFlags.Ephemeral
        });

        if (!user.kickable) return interaction.reply({
            content: `The user is not kickable.`, 
            flags: client.discord.MessageFlags.Ephemeral
        }); 
        if (user.roles.highest.position >= interaction.member.roles.highest.position) {
          return interaction.reply({content: "You cannot kick Someone who has higher or same role as you.", flags: client.discord.MessageFlags.Ephemeral})
        }
        if (user.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
            return interaction.reply({content: "I cannot kick Someone who has higher or same role as me.", flags: client.discord.MessageFlags.Ephemeral})
        }
            const message = new EmbedBuilder()
               .setAuthor({name: `${user.user.displayName} has been successfully kicked.`, iconURL: user.user.displayAvatarURL()})
               .setDescription(`**Reason:** ${reasonInput}`)
               .setColor(client.color)
          await user.kick(reasonInput).then(()=>{
              interaction.reply({ embeds: [message] });
        })
    }
};
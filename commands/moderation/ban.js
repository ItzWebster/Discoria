const { EmbedBuilder, ApplicationCommandOptionType, ApplicationCommandType } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Ban a user.',
    userprems: ["KickMembers", "BanMembers"],
    botprems: ["BanMembers"],
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "member",
            description: "The member you want to ban!",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "member",
                    description: "The member you want to ban!",
                    required: true,
                    type: ApplicationCommandOptionType.User,
                },
                {
                    name: "reason",
                    description: "The reason for the ban!",
                    required: false,
                    type: ApplicationCommandOptionType.String,
                }
            ]
        },
        {
            name: "hack",
            description: "Bans a member who is not in your server!",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "The ID of the member you want to ban!",
                    required: true,
                    type: ApplicationCommandOptionType.User,
                },
                {
                    name: "reason",
                    description: "The reason for the ban!",
                    required: false,
                    type: ApplicationCommandOptionType.String,
                }
            ]
        },
        {
            name: "remove",
            description: "Removes a ban from a member!",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "The ID of the member you want to remove a ban from!",
                    required: true,
                    type: ApplicationCommandOptionType.User,
                },
                {
                    name: "reason",
                    description: "The reason for the ban!",
                    required: false,
                    type: ApplicationCommandOptionType.String
                }
            ]
        }
    ],
    run: async (client, interaction) => {
        if (interaction.options.getSubcommand() === "member") {
            const user = interaction.options.getMember('member');
            const reasonInput = interaction.options.getString('reason') || 'No reason was provided';
            if(user.id === client.user.id) return interaction.reply({ content: "Why are you trying ban me :(", flags: client.discord.MessageFlags.Ephemeral });
            if (!user) return interaction.reply({ content: `The user is not in the server.`, flags: client.discord.MessageFlags.Ephemeral});
            if (!user.bannable) return interaction.reply({ content: `The user is not bannable.`, flags: client.discord.MessageFlags.Ephemeral });
            if (user.roles.highest.position >= interaction.member.roles.highest.position) {
                return interaction.reply({ content: "You cannot ban someone who has a higher or the same role as you.", flags: client.discord.MessageFlags.Ephemeral });
            }
            if (user.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
                return interaction.reply({ content: "I cannot ban someone who has a higher or the same role as me.", flags: client.discord.MessageFlags.Ephemeral });
            }

            const van = new EmbedBuilder()
                .setAuthor({ name: `${user.user.tag} has been successfully banned.`, iconURL: user.user.displayAvatarURL() })
                .setDescription(`**Reason:** ${reasonInput}`)
                .setColor(client.color);

            await user.ban({ reason: reasonInput }).then(() => {
                interaction.reply({ embeds: [van] });
            }).catch(() => { });

        } else if (interaction.options.getSubcommand() === "hack") {
            const user = interaction.options.getUser('user');            
            const reasonInput = interaction.options.getString('reason') || 'No reason was provided';
            const member = await interaction.guild.members.fetch(user.id).catch(() => null);
            if (member) {
                return interaction.reply({ content: `This user is already in the server. Use the regular ban command instead.`, flags: client.discord.MessageFlags.Ephemeral });
            }

            const message = new EmbedBuilder()
                .setAuthor({ name: `${user.tag} has been successfully banned.`, iconURL: user.displayAvatarURL() })
                .setDescription(`**Reason:** ${reasonInput}`)
                .setColor(client.color);

            await interaction.guild.members.ban(user, { reason: reasonInput }).then(() => {
                interaction.reply({ embeds: [message] });
            }).catch(() => { });

        } else if (interaction.options.getSubcommand() === "remove") {
            const user = interaction.options.getUser('user');
            if(user.id === client.user.id) return interaction.reply({ content: "I'm not banned???", flags: client.discord.MessageFlags.Ephemeral });
            const reasonInput = interaction.options.getString('reason') || 'No reason was provided';
            await interaction.guild.members.unban(user, reasonInput).then(() => {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: `${user.tag} has been successfully unbanned.`, iconURL: user.displayAvatarURL() })
                            .setDescription(`**Reason:** ${reasonInput}`)
                            .setColor(client.color)
                    ]
                });
            }).catch(() => { });
        }
    }
};

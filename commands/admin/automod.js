const { ApplicationCommandType, EmbedBuilder, ApplicationCommandOptionType, } = require("discord.js");

module.exports = {
    name: "automod",
    description: "Setup Automod for your server.",
    type: ApplicationCommandType.ChatInput,
    userprems: ["Administrator"],
    botprems: ["Administrator"],
    options: [
        {
            name: "flagged-words",
            description: "Blocks profanity, specific content, and slurs from being sent.",
            type: ApplicationCommandOptionType.Subcommand,
            
        },
        {
            name: "spam-messages",
            description: "Stops spam from being sent.",
            type: ApplicationCommandOptionType.Subcommand,
            
        },
        {
            name: "mention-spam",
            description: "Stops users from spam pinging members.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "number",
                    description: "Specified amount will be used as the max mention amount.",
                    required: true,
                    type: ApplicationCommandOptionType.Number,
                }
            ]
        },
        {
            name: "keyword",
            description: "Block a specified word in the Server.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "word",
                    description: "Specified word will be blocked from being sent.",
                    required: true,
                    type: ApplicationCommandOptionType.String,
                }
            ]
        },
    ],
    run: async(client, interaction) => {
        const { guild, options } = interaction;
        const sub = options.getSubcommand();
        switch (sub) {
            case "flagged-words":

             await interaction.reply({ content: `Loading your **automod rule**..`});

            const rule = await guild.autoModerationRules.create({
                name: `Block profinity, sexual content, and slurs by ${client.user.displayName}.`,
                creatorId: client.user.id,
                enabled: true,
                eventType: 1,
                triggerType: 1,
                triggerMetadata: 
                    {
                        presets: [1, 2, 3]
                    },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 10,
                            customMessage: `This message was prevented by ${client.user.displayName}!`
                        }
                    }
                ]
            }).catch(async err => {
                setTimeout(async () => {
                   return await interaction.editReply({ content: `${err}`});
                }, 2000)
            })

            setTimeout(async () => {
                if (!rule) return;

                const embed = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`Flagged Words rule added\n will be deleted.`)

                await interaction.editReply({
                    content: ``,
                    embeds: [embed]
                })
            }, 3000)

            break;

            case 'keyword':

            await interaction.reply({ content: `Loading your **automod rule**..` });
            const word = options.getString("word");

            const rule2 = await guild.autoModerationRules.create({
                name: `Prevent the word ${word} by ${client.user.displayName}.`,
                creatorId: client.user.id,
                enabled: true,
                eventType: 1,
                triggerType: 1,
                triggerMetadata: 
                    {
                        keywordFilter: [`${word}`]
                    },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 10,
                            customMessage: `This message was prevented by ${client.user.displayName}.`
                        }
                    }
                ]
            }).catch(async err => {
                setTimeout(async () => {
                    return await interaction.editReply({ content: `${err}`})
                }, 2000)
            })

            setTimeout(async () => {
                if (!rule2) return;

                const embed2 = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`Keyword Filter added, Messages \n with **${word}** will be deleted`)

                await interaction.editReply({
                    content: ``,
                    embeds: [embed2]
                })
            }, 3000)

            break;

            case 'spam-messages':

            await interaction.reply({ content: `Loading your **automod rule**..` });
            

            const rule3 = await guild.autoModerationRules.create({
                name: `Prevent Spam Messages by ${client.user.displayName}.`,
                creatorId: client.user.id,
                enabled: true,
                eventType: 1,
                triggerType: 1,
                triggerMetadata: 
                    {
                        mentionTotalLimit: 3,
                    },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 10,
                            customMessage: `This message was prevented by ${client.user.displayName}.`
                        }
                    }
                ]
            }).catch(async err => {
                setTimeout(async () => {
                    return await interaction.editReply({ content: `${err}`})
                }, 2000)
            })

            setTimeout(async () => {
                if (!rule3) return;

                const embed3 = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`Spam Rule added, all spam messages \n will be deleted.`)

                await interaction.editReply({
                    content: ``,
                    embeds: [embed3]
                })
            }, 3000)

            break;

            case 'mention-spam': 
            await interaction.reply({ content: `Loading your **automod rule**..` });
            const number =  options.getNumber("number")

            const rule4 = await guild.autoModerationRules.create({
                name: `Prevent Spam Mentions by ${client.user.displayName}.`,
                creatorId: client.user.id,
                enabled: true,
                eventType: 1,
                triggerType: 1,
                triggerMetadata: 
                    {
                        mentionTotalLimit: number
                    },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 2,
                            customMessage: `This message was prevented by ${client.user.displayName}.`
                        }
                    }
                ]
            }).catch(async err => {
                setTimeout(async () => {
                    return await interaction.editReply({ content: `${err}`})
                }, 2000)
            })

            setTimeout(async () => {
                if (!rule4) return;

                const embed4 = new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`Spam Mention Rule added, all spam messages \n will be deleted.`)

                await interaction.editReply({
                    content: ``,
                    embeds: [embed4]
                })
            }, 3000)

            break;

        }
    }
}
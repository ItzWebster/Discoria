const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, MessageFlags } = require('discord.js');
const { v4: uuidv4 } = require('uuid');
const WarningsSchema = require("../../models/warnings.js");

module.exports = {
    name: 'warn',
    description: 'Add or delete a warning from a user.',
    type: ApplicationCommandType.ChatInput,
    userprems: ["KickMembers", "BanMembers"],
    options: [
        {
            name: 'add',
            description: 'Add a warning to a user.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user to warn.',
                    type: ApplicationCommandOptionType.User,
                    required: true
                },
                {
                    name: 'reason',
                    description: 'The reason for the warn.',
                    type: ApplicationCommandOptionType.String,
                    required: false
                }
            ]
        },
        {
            name: 'delete',
            description: 'Delete a warning from a user.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user to delete one of their warnings.',
                    type: ApplicationCommandOptionType.User,
                    required: true
                },
                {
                    name: 'id',
                    description: 'The warn ID.',
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: 'clear',
            description: 'Clear all warnings off a user.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user to delete all their warnings.',
                    type: ApplicationCommandOptionType.User,
                    required: true
                }
            ]
        },
        {
            name: 'check',
            description: 'checking all warnings from a user.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'checking all warnings from a user.',
                    type: ApplicationCommandOptionType.User,
                    required: true
                }
            ]
        }
    ],
    run: async (client, interaction) => {
        if (interaction.options.getSubcommand() === 'add') {
            const user = interaction.options.getMember('user');
            const reasonInput = interaction.options.getString('reason') || 'No reason was provided';
            if (!user) return interaction.reply({
                content: `The user is not in the server.`,
                 flags: MessageFlags.Ephemeral
            });
           if (user.roles.highest.position >= interaction.member.roles.highest.position) {
          return interaction.reply({content: "You cannot warn Someone who has higher or same role as you.",  flags: MessageFlags.Ephemeral})
        }
        if (user.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
            return interaction.reply({content: "I cannot warn Someone who has higher or same role as me.",  flags: MessageFlags.Ephemeral})
        }

            WarningsSchema.findOne(
                {
                    user: user.user.id,
                    guild: interaction.guild.id
                }, async (err, data) => {
                    if (err) throw err;

                    const uuidGenerated = uuidv4();

                    if (!data) {
                        data = new WarningsSchema(
                            {
                                user: user.user.id,
                                guild: interaction.guild.id,
                                warnings: [
                                    {
                                        moderator: interaction.user.id,
                                        since: new Date(),
                                        warnId: uuidGenerated,
                                        reason: reasonInput
                                    }
                                ]
                            }
                        );
                    } else {
                        data.warnings.push(
                            {
                                moderator: interaction.user.id,
                                since: new Date(),
                                warnId: uuidGenerated,
                                reason: reasonInput
                            }
                        );
                    };

                    data.save();
             const message = new EmbedBuilder()
               .setAuthor({name: `${user.displayName} has been successfully warned.`, iconURL: user.displayAvatarURL()})
               .setDescription(`**Reason:** ${reasonInput}`)
               .setColor(client.color)
             interaction.reply({ embeds: [message] });
        
                }
            );
        };

        if (interaction.options.getSubcommand() === 'delete') {
            const user = interaction.options.getMember('user');
            const idInput = interaction.options.getString('id') ;
            if (!user) return interaction.reply({
                content: `The user is not in the server.`,
                ephemeral: true
            });    
            WarningsSchema.findOne(
                {
                    user: user.user.id,
                    guild: interaction.guild.id
                }, async (err, data) => {
                    if (err) throw err;

                    if (data && data.warnings?.length > 0) {
                        let boolean = false;

                        for (let warns of data.warnings) {
                            if (warns.warnId === idInput) boolean = true;
                        };

                        if (boolean === false) return interaction.reply({
                            content: `Invalid Warn ID.`,
                            ephemeral: true
                        });

                        const arr = data.warnings.filter(object => {
                            return object.warnId !== idInput
                        });
                        data.warnings = arr;
                        data.save();
                        return interaction.reply({
                            content: `Ive deleted Warn ID \`${idInput}\` off of ${user}'s warnings.`,
                             flags: MessageFlags.Ephemeral
                        });
                    } else {
                        return interaction.reply({
                            content: `${user} has no warnings.`,
                             flags: MessageFlags.Ephemeral
                        });
                    };
                }
            );
        };

        if (interaction.options.getSubcommand() === 'clear') {
            const user = interaction.options.getMember('user');
            if (!user) return interaction.reply({
                content: `The user is not in the server.`,
                 flags: MessageFlags.Ephemeral
            });

            WarningsSchema.findOne(
                {
                    user: user.user.id,
                    guild: interaction.guild.id
                }, async (err, data) => {
                    if (err) throw err;

                    if (data && data.warnings?.length > 0) {
                        await WarningsSchema.deleteOne({
                            user: user.user.id,
                            guild: interaction.guild.id
                        });

                        return interaction.reply({
                            content: `I've deleted all of ${user}'s warnings.`,
                             flags: MessageFlags.Ephemeral
                        });
                    } else {
                        return interaction.reply({
                            content: `${user} has no warnings.`,
                             flags: MessageFlags.Ephemeral
                        });
                    };
                }
            );
        };
         if (interaction.options.getSubcommand() === 'check') {
        const user = interaction.options.getMember('user');
        let currentPage = 0;
    const max = 5
      if (!user) return interaction.reply({
        content: `The user is not in the server.`,
         flags: MessageFlags.Ephemeral
    });
    WarningsSchema.findOne(
        {
            user: user.user.id,
            guild: interaction.guild.id
        }, async (err, data) => {
          if(err) throw err;
          if(data){
              const listEmbed = new EmbedBuilder()
              .setAuthor({name: `${user.user.displayName}'s warning`, iconURL: user.user.displayAvatarURL()})
              .setColor(client.color)
      
              // mapping total fields in the database
              const fields = await Promise.all(data.warnings.map(async (w, i) => { 
              const moderator = await interaction.guild.members.fetch(w.moderator).catch(err => { });
              return {
                  name: `#\`${i + 1}\` ID: \`${w.warnId}\``,
                  value: `**Moderator**: ${moderator.nickname ? moderator.nickname : moderator.displayName || "Member Not Found"}\n**Since**: <t:${(new Date(w.since).getTime() / 1000).toString().split('.')[0]}> (<t:${(new Date(w.since).getTime() / 1000).toString().split('.')[0]}:R>)\n**Reason**: ${w.reason}`,
                  inline: false
               }})); 
              listEmbed.addFields(fields);

              // safely sending the embed if data.Content has less than 9 values
              if(fields.length <= max){
                  return interaction.reply({ embeds: [listEmbed] })
              };
  
              // chunkify funtion: SCROLL DOWN!!
              const chunks = await chunkify(fields, max); // creating chunks of fields to paginate them one by one
              const pages = []; // array of embeds
              chunks.forEach((chunk) => {
                  const chunkEmbed = new EmbedBuilder()
                  .setAuthor({name: `${user.user.displayName}'s warning`, iconURL: user.user.displayAvatarURL()})
                  .setColor(client.color)
                  .addFields(chunk)

                  pages.push(chunkEmbed); // pushing each embed into the array
              });
             const msg = await interaction.reply({ embeds: [pages[currentPage]], components: [row], withResponse: true })
                const collector = msg.resource.message.createMessageComponentCollector();
                setTimeout(() => { msg.resource.message.edit({ components: [] }) }, 60 * 1000)
                collector.on('collect', async x => {
                    if (x.user.id !== interaction.user.id) return x.reply({ content: `You are not allowed to use buttons.`, flags: MessageFlags.Ephemeral });
                    x.deferUpdate();
                    if (x.customId == "page_previous") {
                        if (currentPage - 1 < 0) {
                            currentPage = pages.length - 1
                        } else {
                            currentPage -= 1;
                        }
                    } else if (x.customId == "page_next") {
                        if (currentPage + 1 == pages.length) {
                            currentPage = 0;
                        } else {
                            currentPage += 1;
                        }
                    }
                    if (x.customId == "page_previous" || x.customId == "page_next") {
                        msg.resource.message.edit({ embeds: [pages[currentPage]], components: [row] });
                    }
                })
          } else {
              // if member has no data
              interaction.reply(`**${user.user.username}** has no warnings`)            
          }
      })

      // CHUNKIFY function 
      function chunkify(arr, len){
          let chunks = [];
          let i = 0;
          let n = arr.length;

          while(i < n){
              chunks.push(arr.slice(i, i += len));
          }

          return chunks;
      }
        }
    },
};
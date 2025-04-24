const { EmbedBuilder, ApplicationCommandOptionType, ApplicationCommandType } = require('discord.js');

module.exports = {
  name: "dev",
  description: "Developer Commands",
  type: ApplicationCommandType.ChatInput,
  ownerOnly: true,
  options: [
    {
        name: "reload",
        description: "reloads commands",
        type: ApplicationCommandOptionType.Subcommand,
    },
    {
        name: "eval",
        description: "Evaluate a given code!",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
                name: "code",
                description: "what do you want me do Evaluate",
                required: true,
                type: ApplicationCommandOptionType.String,
            }
        ]
      },
      {
        name: "cleardm",
        description: "Deletes last DM Bot Message in your dms.",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
                name: "user",
                description: "Deletes last DM Bot Message.",
                required: false,
                type: ApplicationCommandOptionType.User,
            }
        ]
      }
 ],
run: async (client, interaction) => {
if (interaction.options.getSubcommand() === "eval") {
    const code = interaction.options.getString("code")
    let result;
    if (code.includes('await')) {
        result =  new Promise(async(resolve) => resolve(await eval(`(async () => { return ${code}; })()`)))
        } else {
        result = new Promise((resolve) => resolve(eval(code)));
    }
    return result
        .then((output) => {
        if (typeof output !== "string") {
             output = require("util").inspect(output, { depth: 0 });
        }
        if (output.includes(client.config.token) || output.includes(client.config.mongooseConnectionString)) {
             return interaction.reply({embeds: [new EmbedBuilder().setTitle("This code string is disabled!").setDescription("Tokens cannot be obtained through this command!").setColor(client.color)]})

        }
    let embed = new EmbedBuilder()
    .addFields({ name: "Input", value: `\`\`\`js\n${code}\n\`\`\`` })
    .addFields({ name: "Output", value: `\`\`\`js\n${output}\n\`\`\``})
    .setColor(client.color)
    interaction.reply({ embeds: [embed] })
}).catch((err) => {
            err = err.toString();
            if (err.includes(client.config.token)) {
                return interaction.reply({embeds: [new EmbedBuilder().setTitle("This code string is disabled!").setDescription("Tokens cannot be obtained through this command!").setColor(client.color)]})
            }
            return interaction.reply(err, {
                code: "js",
            });
        });
 } else if (interaction.options.getSubcommand() === "reload") {
     client.shard.broadcastEval(c => c.handleCommands(c) )
    interaction.reply({embeds: [new EmbedBuilder().setDescription(`Successfully reloaded all the application (/) commands.`).setColor(client.color)]})
  } else if (interaction.options.getSubcommand() === "cleardm") {
    const mentionedUser = interaction.options.getUser("user") ||  interaction.user;
    if (!mentionedUser)
     return interaction.reply({embeds: [new EmbedBuilder().setDescription("Member not found") .setColor(client.color) ], flags: client.discord.MessageFlags.Ephemeral
})
     const dmchannel = mentionedUser.dmChannel || (await mentionedUser.createDM());
        dmchannel.messages.fetch( { limit: 100 } ).then( messages => {
         const botMessages = messages.filter((m) => m.author.bot) 
         c = botMessages.size
         interaction.reply({content: `Deleting ${c} DMs.`, withResponse: true }).then( ms => {
         botMessages.forEach(msg => {
          msg.delete().then( () => {
                c --;
                 if (c === 0 ) ms.resource.message.edit( 'DMs deleted successfully.')
                    }).catch( err => { ms.resource.message.edit( `Error occurred while deleting DMs.\n${err}` ) } );
              })
          });
      }
      )
  }
 },
};

const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags } = require('discord.js')
const Schema = require("../../models/birthdays");


module.exports = {
    name: "birthdays",
    description: "View or register a birthday",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "set",
            description: "Set your birthday",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "day",
                    description: "The day number that is your birthday",
                    required: true,
                    type: ApplicationCommandOptionType.Number,
                },
                {
                  name: "month",
                  description: "the month number that is your birthday",
                  required: true,
                  type: ApplicationCommandOptionType.Number,
              }
            ]
        },
        {
            name: "check",
            description: "Check your birthday",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "delete",
            description: "Delete your birthday",
            type: ApplicationCommandOptionType.Subcommand,
        }, 
         {
            name: "list",
            description: "Get to see all birthdays",
            type: ApplicationCommandOptionType.Subcommand,
        },
       ],

run: async (client, interaction) => {
if (interaction.options.getSubcommand() === "set") {
const months = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December"
};

const day = interaction.options.getNumber('day');
const month = interaction.options.getNumber('month');

if (!day || day > 31 || day < 0) return interaction.reply({content: "Wrong day format!"})
if (!month || month > 12 || day < 0) return interaction.reply({content: "Wrong month format!"});

const convertedDay = suffixes(day);
const convertedMonth = months[month];
const birthdayString = `${convertedDay} of ${convertedMonth}`;

Schema.findOne({ Guild: interaction.guild.id, User: interaction.user.id }, async (err, data) => {
  if (data) {
      data.Birthday = birthdayString;
      data.save();
  }
  else {
      new Schema({
          Guild: interaction.guild.id,
          User: interaction.user.id,
          Birthday: birthdayString,
      }).save();
  }
})
interaction.reply({embeds: [new EmbedBuilder().setTitle('🎉 Birthday Confirmation 🎉')
.setDescription(`You have set your birthday for the date: **${birthdayString}**`).setColor(client.color)]})
} else  if (interaction.options.getSubcommand() === "list") {
let currentPage = 0;
const max = 6
  const rawBirthdayboard = await Schema.find({ Guild: interaction.guild.id })
    if (rawBirthdayboard.length < 1) return interaction.reply({ content: "No birthdays found!"});
    const listEmbed = new EmbedBuilder()
    .setTitle(`Birthdays - ${interaction.guild.name}`)
    .setColor(client.color)
    const fields = await Promise.all(rawBirthdayboard.map(async (data) => { 
        const user = await interaction.guild.members.fetch(data.User).catch(err => { });
        if (!user) return Schema.findOneAndDelete({ Guild: interaction.guild.id, User: user.id });
        return {
            name: `${user.nickname ? user.nickname : user.displayName}`,
            value: `**${data.Birthday}**`,
            inline: false,
          };
     }));
     if(fields.length <= max){
        listEmbed.addFields(fields);
          return interaction.reply({ embeds: [listEmbed] })
      };
          const chunks = await chunkify(fields, max); // creating chunks of fields to paginate them one by one
      const pages = []; // array of embeds
      chunks.forEach((chunk) => {
          const chunkEmbed = new EmbedBuilder() 
          .setTitle(`Birthdays - ${interaction.guild.name}`)
          .setColor(client.color)
          .addFields(chunk)
          pages.push(chunkEmbed);
      });
  
      const row = new ActionRowBuilder()
          .addComponents(
              new ButtonBuilder()
                  .setCustomId('page_previous')
                  .setEmoji("1247074945431900261")
                  .setLabel("Previous")
                  .setStyle(ButtonStyle.Secondary),

              new ButtonBuilder()
                  .setCustomId('page_next')
                  .setEmoji("1247074948099473510")
                   .setLabel("Next")
                  .setStyle(ButtonStyle.Secondary)
          );

     const msg = await interaction.reply({ embeds: [pages[currentPage]], components: [row], withResponse: true })
      const collector = msg.resource.message.createMessageComponentCollector();
      setTimeout(() => { msg.resource.message.edit({ components: [] }) }, 60 * 1000)
      collector.on('collect', async x => {
          if (x.user.id !== interaction.user.id) return x.reply({ content: `You are not allowed to use buttons.`, flags: MessageFlags.Ephemeral});
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

  } else  if (interaction.options.getSubcommand() === "delete") {
    Schema.findOne({ Guild: interaction.guild.id, User: interaction.user.id }, async (err, data) => {
      if (!data) return interaction.reply({ content: "No birthday found!"});
      Schema.findOneAndDelete({ Guild: interaction.guild.id, User: interaction.user.id }).then(() => {
          interaction.reply({ content: "Deleted your birthday"})
      })
  })
  } else  if (interaction.options.getSubcommand() === "check") {
    Schema.findOne({ Guild: interaction.guild.id, User: interaction.user.id }, async (err, data) => {
      if (!data) return interaction.reply({ content: "No birthday found!"});
      interaction.reply({embeds: [new EmbedBuilder().setDescription(`Your birthday is currently set for the date: **${data.Birthday}**`).setColor(client.color)]})
  })
  }

 }
}

function suffixes(number) {
const converted = number.toString();

const lastChar = converted.charAt(converted.length - 1);

return lastChar == "1" ?
  `${converted}st` : lastChar == "2" ?
      `${converted}nd` : lastChar == '3'
          ? `${converted}rd` : `${converted}th`
}
function chunkify(arr, len){
    let chunks = [];
    let i = 0;
    let n = arr.length;

    while(i < n){
        chunks.push(arr.slice(i, i += len));
    }

return chunks;
}
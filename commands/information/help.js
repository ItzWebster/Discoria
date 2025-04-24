const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ApplicationCommandType, ApplicationCommandOptionType, MessageFlags } = require("discord.js");
const { readdirSync } = require("fs");
const create_mh = require('../../functions/help');
const prefix = '/'
module.exports = {
  name: "help",
  description: "Shows all available Discoria commands",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
        name: 'command-name',
        description: 'view a command',
        type: ApplicationCommandOptionType.String,
        required: false
    }
],
  run: async (client, interaction) => {

    let categories = [];
    let cots = [];

    if (!interaction.options.getString("command-name")) {

      //categories to ignore
      let ignored = [
        "developer",
        "context",
       ];

      
      const emo = {
        information: "Information",
        admin: "Administration",
        moderation: "Moderation",
        birthdays: "Birthdays"
      }
      
      


      let ccate = [];

      readdirSync("./commands/").forEach((dir) => {
        if (ignored.includes(dir.toLowerCase())) return;
        const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
          file.endsWith(".js")
        );

        if (ignored.includes(dir.toLowerCase())) return;

        const name = `${emo[dir.toLowerCase()]}`;
        //let nome = dir.charAt(0).toUpperCase() + dir.slice(1).toLowerCase();
        let nome = dir.toUpperCase();

        let cats = new Object();

        cats = {
          name: name,
          value: `\`${prefix}help ${dir.toLowerCase()}\``,
          inline: true
        }


        categories.push(cats);
        ccate.push(nome);
      });

      const embed = new EmbedBuilder()
        .setAuthor({name: `${client.user.displayName} Help Menu`, iconURL: client.user.displayAvatarURL()})
       .setDescription(`My prefix is ${prefix}\nUse the menu, or use \`${prefix}help [category]\` to view commands base on their category!`)
        .addFields(categories)
        .setThumbnail(client.user.displayAvatarURL({
          dynamic: true
        }))
       .setColor(client.color)


      let menus = create_mh(ccate);
      return await interaction.reply({ embeds: [embed], components: menus.smenu,  withResponse: true }).then((msgg) => {

        const menuID = menus.sid;
         const filter = async ii => {
            if (ii.user.id !== interaction.user.id) {
                 ii.reply({embeds: [
                new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`Hey **${ii.user.displayName}**, You can't use the menu! Only **${interaction.user.displayName}** can do that! If you want control menu by yourself run ${prefix}help`)
            ], flags: MessageFlags.Ephemeral });
                      return false;
                 };
                    return true;
          }
        const collector = msgg.resource.message.createMessageComponentCollector({
             filter,
             componentType: ComponentType.StringSelect,
             time: 60000,
             idle: 60000 / 2,
            });
        collector.on('collect', async i  => {
          if (i.customId != menuID) return;

          let {
            values
          } = i;

          let value = values[0];

          let catts = [];

          readdirSync("./commands/").forEach((dir) => {
            if (dir.toLowerCase() !== value.toLowerCase()) return;
            const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
              file.endsWith(".js")
            );


            const cmds = commands.map((command) => {
              let file = require(`../../commands/${dir}/${command}`);

              if (!file.name) return "No command name.";

              let name = file.name.replace(".js", ""); 
              let des = client.commands.get(name).description ;
              let emo = client.commands.get(name).emoji;
              let emoe = emo ? `${emo} - ` : '';

              let obj = {
                cname: `${emoe}\`${name}\``,
                des
              }

              return obj;
            });

            let dota = new Object();

            cmds.map(co => {
              if (co == undefined) return;

              dota = {
                name: `${cmds.length === 0 ? "In progress." : co.cname}`,
                value: co.des ? co.des : 'No Description',
                inline: true,
              }
              catts.push(dota)
            });

            cots.push(dir.toLowerCase());
          });

          if (cots.includes(value.toLowerCase())) {
            const combed = new EmbedBuilder()
              .setTitle(`__${value.charAt(0).toUpperCase() + value.slice(1)} Commands!__`)
              .setDescription(`Use \`${prefix}help\` followed by a command name to get more information on a command.\nFor example: \`${prefix}help ping\`.\n\n`)
              .addFields(catts)
              .setColor(client.color)

           await i.deferUpdate();

            return i.message.edit({ embeds: [combed], components: menus.smenu })
          };
        });

  
    collector.on("end", () => {
    msgg.resource.message.edit({
        embeds: [ new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`To see the help menu again please type \`${prefix}help\` Or to see commands from category please type \`${prefix}help [category]\``)
    ],
    components: [],
     });
    });
   });

    } else {
      let catts = [];

      readdirSync("./commands/").forEach((dir) => {
        if (dir.toLowerCase() !== interaction.options.getString("command-name").toLowerCase()) return;
        const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
          file.endsWith(".js")
        );

        
        const cmds = commands.map((command) => {
          let file = require(`../../commands/${dir}/${command}`);

          if (!file.name) return "No command name.";

          let name = file.name.replace(".js", "");

          if (client.commands.get(name).hidden) return;


          let des = client.commands.get(name).description;
          let emo = client.commands.get(name).emoji;
          let emoe = emo ? `${emo} - ` : '';

          let obj = {
            cname: `${emoe}\`${name}\``,
            des
          }

          return obj;
        });

        let dota = new Object();

        cmds.map(co => {
          if (co == undefined) return;

          dota = {
            name: `${cmds.length === 0 ? "In progress." : co.cname}`,
            value: co.des ? co.des : 'No Description',
            inline: true,
          }
          catts.push(dota)
        });

        cots.push(dir.toLowerCase());
      });

      const command = client.commands.get(interaction.options.getString("command-name")) 

      if (cots.includes(interaction.options.getString("command-name").toLowerCase())) {
        const combed = new EmbedBuilder()
          .setTitle(`__${client.user.displayName} Commands!__`)
          .setDescription(`Use \`${prefix}help\` followed by a command name to get more information on a command.\nFor example: \`${prefix}help ping\`.\n\n`)
          .addFields(catts)
      .setColor(client.color)

        return interaction.reply({ embeds: [combed] })
      };

      if (!command) {
        const embed = new EmbedBuilder()
          .setTitle(`Command not found, Use \`${prefix}help\` for all of my commands.`)
          .setColor(client.color)

        return await interaction.reply({ embeds: [embed]});
      }

      const embed2 = new EmbedBuilder()
        .setTitle("Command Details:")
        .addFields({ name:
          "Command:", value:
          command.name ? `\`${command.name}\`` : "No name for this command."
        })
        .addFields({ name:
          "Usage:", value:
          command.usage ?
            `\`${prefix}${command.name} ${command.usage}\`` :
            `\`${prefix}${command.name}\``
        })
        .addFields({ name:
          "Command Description:", value:
          command.description ?
            command.description :
            "No description for this command."
        })
      .setColor(client.color)
        .setFooter({text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })

        .setTimestamp()
      return await interaction.reply({ embeds: [embed2]});
    }
  },
};
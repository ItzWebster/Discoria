const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandType, MessageFlags } = require("discord.js")
module.exports = {
  name: "ping",
  type: ApplicationCommandType.ChatInput,
  description: "View all the shards latency of Discoria",
run: async(client, interaction) => {
  let currentPage = 0;
   const max = 3
 await client.shard.broadcastEval((c) => {
        return {
            guilds: c.guilds.cache.size,
            members: c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
            shards: c.shard.ids,
            uptime: c.uptime,
            ping: c.ws.ping,
            ram: process.memoryUsage().rss,
            cpu: process.cpuUsage().system / process.cpuUsage().user, 
     };
  }).then(async (results) => {
       const listEmbed = new EmbedBuilder()
         .setTitle(`${client.user.displayName} Status:`)
       .setColor(client.color)
 const fields = results.map((data) => {
      let ifGuild;
      if (Number(data.shards) == client.shard.ids) {
        ifGuild = `(Current)`;
      } else {
        ifGuild = "";
      } return {
          name: `<:online:1315142871367548978> Shard ${Number(data.shards)} ${ifGuild}\n`,
          value: `<:Blank:1315143186707906620>${getMsEmoji(data.ping)} **Latency:** \`${data.ping}ms\`\n<:Blank:1315143186707906620><:Clock:1315146847634980865> **Uptime:** \`${formatUptime(data.uptime / (1000 * 60))}\`\n<:Blank:1315143186707906620><:App_Directory_Utilities_white:1315146489730961479> **System:**\n<:Blank:1315143186707906620><:Blank:1315143186707906620><:Settings:1315145980902903950> RAM: \`${formatBytes(data.ram)}\`\n<:Blank:1315143186707906620><:Blank:1315143186707906620><:loading:1315145822022668371> CPU: \`${data.cpu.toFixed(2)}%\`\n<:Blank:1315143186707906620><:Communication:1315146466045726801> **Size:**\n<:Blank:1315143186707906620><:servers:1315144940526899290> Servers: \`${client.kFormatter(data.guilds)}\`\n<:Blank:1315143186707906620><:Users:1315144738898182148> Members: \`${client.kFormatter(data.members)}\``,
          inline: true,
        };
   });
          if(fields.length <= max){
                  listEmbed.addFields(fields);
                    return interaction.reply({ embeds: [listEmbed] })
                };
                    const chunks = await chunkify(fields, max); // creating chunks of fields to paginate them one by one
                const pages = []; // array of embeds
                chunks.forEach((chunk) => {
                    const chunkEmbed = new EmbedBuilder()
                   .setTitle(`${client.user.displayName} Status:`)
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
                    if (x.user.id !== interaction.user.id) return x.reply({ content: `You are not allowed to use buttons.`, flags: MessageFlags.Ephemeral})

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
     })  
  }
}
function getMsEmoji(ms) {
      let emoji = undefined;
      for (const [ key, value ] of Object.entries({
        45: '<:better:1315143810891776100>',
        100: '<:good:1315143970103234621>',
        500: '<:low:1315143954420994088>'
      })) if (ms <= key) {
        emoji = value;
        break;
      }
      return (emoji ??= '<:low:1315143954420994088>');
};
function formatBytes(a) {
 if (0 == a) return "0 B"
 let c = 1024;
 const e = ['B', 'KB', 'MB', 'GB', 'TB', 'TP', 'EB', 'ZB', 'YB']
 let f = Math.floor(Math.log(a) / Math.log(c));
 return parseFloat((a / Math.pow(c, f)).toFixed(0)) + " " + e[f];
};

function chunkify(arr, len){
    let chunks = [];
    let i = 0;
    let n = arr.length;

        while(i < n){
            chunks.push(arr.slice(i, i += len));
        }

    return chunks;
}
function formatUptime(uptimeMinutes) {
    if (uptimeMinutes < 60) {
        return `${Math.round(uptimeMinutes)}m`;
    } else if (uptimeMinutes < 24 * 60) {
        const hours = Math.floor(uptimeMinutes / 60);
        return `${hours}h`;
    } else if (uptimeMinutes < 24 * 60 * 365) {
        const days = Math.floor(uptimeMinutes / (24 * 60));
        return `${days}d`;
    } else {
        const years = Math.floor(uptimeMinutes / (24 * 60 * 365));
        return `${years}y`;
    }
}

const { token, TopggToken } = require("./config.json")
const { AutoPoster } = require('topgg-autoposter')
const { ShardingManager, EmbedBuilder, WebhookClient, ShardEvents, codeBlock } = require("discord.js")
const shardLogs = new WebhookClient({ url: "" });
const errorLogs = new WebhookClient({ url: "" });

const manager = new ShardingManager("./index.js", {
  respawn: true,
  token: token,
  totalShards: "auto",
  mode: "worker",
});

manager.on('shardCreate', (shard) => {
 shard.on(ShardEvents.Spawn, async () => {
     const spawn = `Shard ${shard.id} connecting to Discord's Gateway.`;
     console.log(spawn);
     shardLogs.send({
         username: 'Shards Logs',
         avatarURL: 'https://discoria.xyz/image/discoria.png',
         embeds: [new EmbedBuilder()
        .setTitle(spawn)
        .setColor("Green")
       ],
   }).catch(() => {
  });
 })
  shard.on(ShardEvents.Ready, () => {
        const ready = `Shard ${shard.id} connected to Discord's Gateway.`;
        console.log(ready);
        shardLogs.send({
         username: 'Shards Logs',
         avatarURL: 'https://discoria.xyz/image/discoria.png',
         embeds: [new EmbedBuilder()
        .setTitle(ready)
        .setColor("Green")
       ],
    }).catch(() => {
  });
 });
 shard.on(ShardEvents.Disconnect, () => {
        const disconnect = `Shard ${shard.id} disconnected from Discord's Gateway.`;
        console.log(disconnect);
        shardLogs.send({
            username: 'Shards Logs',
            avatarURL: 'https://discoria.xyz/image/discoria.png',
            embeds: [new EmbedBuilder()
            .setTitle(disconnect)
            .setColor("Red")
           ],
       }).catch(() => {
      });
      shard.respawn({delay: 5500, timeout: 30000 }).catch(() => {
         const broke = `Shard ${shard.id} was not respawned.`;
            console.log(broke)
            shardLogs.send({
            username: 'Shards Logs',
            avatarURL: 'https://discoria.xyz/image/discoria.png',
            embeds: [new EmbedBuilder()
            .setTitle(broke)
            .setColor("Red")
           ],
        }).catch(() => {
      });
    });
  }); 
   shard.on(ShardEvents.Death, () => {
        const death = `Closing shard ${shard.id} from Discord's Gateway.`;
        console.log(death);
        shardLogs.send({
            username: 'Shards Logs',
            avatarURL: 'https://discoria.xyz/image/discoria.png',
            embeds: [new EmbedBuilder()
            .setTitle(death)
            .setColor("Red")
           ],
    }).catch(() => {
   });
 });
   shard.on(ShardEvents.Error, () => {
        const err = `Shard ${shard.id} had a error.`;
        console.log(err)
        shardLogs.send({
            username: 'Shards Logs',
            avatarURL: 'https://discoria.xyz/image/discoria.png',
            embeds: [new EmbedBuilder()
            .setTitle(err)
            .setColor("Red")
           ],
        }).catch(() => {
    });
  });
})
manager.spawn({ amount: manager.totalShards }).then(() => {
 require("./servers/server.js")(manager)
 manager.broadcastEval(fetchAndSetActivity)
 setInterval(() => {
 manager.broadcastEval(fetchAndSetActivity)
}, 60000);
}).catch((err) => {
    console.error("An error has occurred:", err)
})
async function fetchAndSetActivity(client) {
client.shard.broadcastEval(c => c.guilds.cache.size)
     .then(results => {
      client.user.setPresence({
        status: client.discord.PresenceUpdateStatus.Online,
        activities: [
          {
            name: `/help | ${results.reduce((acc, guildCount) => acc + guildCount, 0).toLocaleString()} servers | Shard ${client.shard.ids}`,
            type: client.discord.ActivityType.Custom,
          },
        ],
    });
 })
}
//const poster = AutoPoster(TopggToken, manager)
//poster.on('posted', (stats) => { })
//poster.on('error', (err) => { })

process.on("SIGABRT", killChildren)
process.on("SIGINT", killChildren)
process.on('unhandledRejection', async (reason, promise) => {
    console.log("unhandled rejection at:", promise, 'reason:', reason)
});
process.on('uncaughtException', (err) => {
    console.log("Uncaught Exception:", err);
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log("Uncaught Exception Monitor:", err, origin);
});
process.on('rejectionHandled', (err) => {
    console.log("rejected handled:", err);
})
process.on('warning', (warning) => {
    console.log("Warning:", warning);
})
function killChildren() {
  manager.shards.forEach(s => s.kill())
}

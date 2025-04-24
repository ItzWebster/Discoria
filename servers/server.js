const { Webhook } = require("@top-gg/sdk");
const webhook = new Webhook("")
const express = require('express');
const app = express(); 
const undici = require('undici');

const stats = {
    guildCount: 0,
    userCount: 0,
    shards: []
}

module.exports = async (manager) => {
app.use((req, res, next) => {
    res.setHeader('ngrok-skip-browser-warning', '*');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

app.get('/api', (req, res) => {
res.status(200).json({ success: "Hello World" })
});

app.get('/api/info', async (req, res) => {
try {
    const promises = [
        await manager.broadcastEval(c => c.guilds.cache.size),
        await manager.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
    ];
 return Promise.all(promises)
     .then(results => {
        return res.status(200).json({ guilds: results[0].reduce((acc, guildCount) => acc + guildCount, 0), users: results[1].reduce((acc, memberCount) => acc + memberCount, 0)})
      })
    } catch (error) {
    res.status(500).json({ error: error.message })
   }
})

app.get("/api/getShard", async (req, res) => {
try {
const { guild } = req.query
 if(!guild || typeof guild !== "string") return res.status(400).json({ error: "missing param guild"})
 if(guild.length > 20 || guild.length < 17 || !guild.match(/^\d+$/gi)) return res.status(400).json({ error: "invalid guild id"})
   await manager.broadcastEval((c, { guildId }) => [c.shard?.ids, c.guilds.cache.has(guildId)], { context: { guildId: guild } })
    .then((result) => {
        for(const row of result) {
            const shardId = number = row[0] instanceof Array ? row[0][0] : 69
            if(typeof row[1] === "boolean" && row[1]) {
                 return res.status(200).send({ found: true, shard: shardId })
            }
        }
     return res.status(404).json({ found: false, shard: null })
   })
} catch (error) {
 res.status(500).json({ error: error.message })
}
})

app.get("/api/stats", async (req, res) => {
try {
    const getStats = async () => {
        const promises = [
           await manager.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
           await manager.broadcastEval(c => [c.shard?.ids, c.ws.status, c.ws.ping, c.uptime, c.guilds.cache.size])
        ]
        const res = await Promise.all(promises)
        let userCount = 0
        for(const gc of res[0]) {
            if(typeof gc === "number") userCount += gc
        }
        return { userCount, shards: res[1] }
    }
        let timesRan = 0
        const statsFunc = () => { 
           getStats().then(r => {
            stats.userCount = r.userCount
            stats.guildCount = 0
            stats.shards = []
            for(const shard of r.shards) {
                if(!(shard instanceof Array) || shard.length !== 5) continue;
                if(typeof shard[4] === "number") stats.guildCount += shard[4]
                stats.shards.push({
                    id: (shard[0] instanceof Array) ? shard[0][0] : 0,
                    status: typeof shard[1] === "number" ? shard[1] : 0,
                    ping:   typeof shard[2] === "number" ? shard[2] : 0,
                    uptime: typeof shard[3] === "number" ? shard[3] : 0,
                    guilds: typeof shard[4] === "number" ? shard[4] : 0

                })
            }
        })
        timesRan += 1
    }

  setTimeout(statsFunc, 1000)
  setInterval(statsFunc, 1000 * 60)
 res.status(200).json(stats)
} catch (error) {
}
})

app.get("/api/dblwebhook", async (req, res) => {
res.status(200).json({ success: "Top.gg Webhook is currently working" })
});

app.post("/api/dblwebhook", webhook.listener(async (vote) => {
try {
await manager.broadcastEval(async (client, { vote }) => {
  let TOPGG = await client.database.user.findOne({ id: vote.user });
    if (!TOPGG) {
        TOPGG =  new client.database.user({
          id: vote.user,
          totalvotes: 0,
          votedAt: 0,
          removeAt: 0,
      });
    }
    TOPGG.votedAt = Date.now();
    TOPGG.totalvotes += 1;
    TOPGG.removeAt = Date.now() + 43200000;
    await TOPGG.save().then(async (data) => {
    const votes = data.totalvotes;
    const time = data.removeAt - Date.now();
    const user = await client.users.fetch(vote.user).catch(err => { });
    const guild = client.guilds.cache.get(""); //support server id
    const channel = guild.channels.cache.get(""); // votes channel id
    const role = guild.roles.cache.get(""); // voters role id
    const member = await guild.members.fetch(vote.user).catch(err => { });
    channel.send({ embeds: [new client.discord.EmbedBuilder()
    .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 64 }))
    .setColor(client.color)
    .setAuthor({ name: `${client.user.displayName}'s Voting System`, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 64 }) })
    .setTitle(`${user.displayName} Just Voted On Top.gg!`)
    .setDescription(`Thank you **${user.displayName}** for voting **${client.user.username}**!`)
    .setFooter({ text: `${user.displayName} has voted ${client.user.username} ${votes == 1 ? `${votes} time so far!` : `${votes.toLocaleString()} times so far!`}` })
    ]})
    user.send({ embeds: [new client.discord.EmbedBuilder()
    .setColor(client.color)
    .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 64 }))
    .setAuthor({ name: `${client.user.username}'s Voting System`, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 64 }) })
    .setTitle(`Thanks for Voting Me On Top.gg!`)
    .setDescription(`Thank you **${user.displayName}** for voting me!`)
    .setFooter({ text: `You have voted ${client.user.username} ${votes == 1 ? `${votes} time so far!` : `${votes.toLocaleString()} times so far!`}` })
    ]})
    if (member) {
    await member.roles.add(role, "Voted on Top.gg").catch(e => {})
    setTimeout(async () => {
     await member.roles.remove(role).catch(e => {})
    }, time);
   }
  })
 }, { context: { vote: vote } })
} catch (error) {
}
}))


app.listen(8000)
}

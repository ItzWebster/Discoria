const welcome = require("../models/welcome");
const auto = require("../models/autorole");
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const client = require("../index.js")

client.on(client.discord.Events.GuildMemberAdd, async (member) => {
  welcome.findOne({ Guild: member.guild.id }, async (e, data) => {
    if (!data) return;
    const canvas = createCanvas(1024, 500);
            const context = canvas.getContext("2d");
            context.font = "72px sans-serif";
            context.fillStyle = "#ffffff";
            const img = await loadImage("https://discoria.xyz/image/welcome.png"); //keep this if you want to but if you're gonna change it, it needs to be a url
            context.drawImage(img, 0, 0, 1024, 500);
            context.fillText("Welcome", 360, 360);
            context.beginPath();
            context.arc(512, 166, 128, 0, Math.PI * 2, true);
            context.stroke();
            context.fill();

            context.font = "42px sans-serif",
            context.textAlign = "center";
            context.fillText(member.user.tag, 512, 410);

            context.font = '32px sans-serif';
            context.fillText(`You are the ${client.addSuffix(member.guild.memberCount)} member to join the server`,512,455);
            context.beginPath();
            context.arc(512, 166, 119, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();

            const avatar = await loadImage(member.user.displayAvatarURL({ extension: "png", size: 1024 }));
            context.beginPath();
            context.arc(512, 166, 128, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();
            context.drawImage(avatar, 384, 38, 256, 256);
        const channel = member.guild.channels.cache.get(data.Channel)
        if(!channel) return;
        channel.send({
            content: data.Message
            .replace(/\{mention\}/g, member.user)
            .replace(/\{user\}/g, member.user.displayName)
            .replace(/\{server\}/g, member.guild.name)
            .replace(/\{membercount\}/g, member.guild.memberCount),
        files: [new client.discord.AttachmentBuilder(await canvas.encode('png'), { name: `welcome-${member.user.id}.png` })],
        }).catch(err => { })
 })
auto.findOne({ Guild: member.guild.id }, async (e, data) => {
 if (!data) return;
    const giverole = await member.guild.roles.cache.get(data.Role)
    if(!giverole) return;
    member.roles.add(giverole, "AutoRole").catch(err => {})
  })
})

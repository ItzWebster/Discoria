const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const mongoose = require("mongoose");

module.exports = async (client) => {
client.handleCommands = async (client) => {
const commands = []
  const SlashCommandsFiles = await globPromise(`${process.cwd()}/commands/*/*.js`);
    SlashCommandsFiles.map(async (path) => {
      delete require.cache[require.resolve(path)];
        const file = require(path);
        if (!file?.name) return
        const splitted = path.split("/");
        const dir = splitted[splitted.length - 2];
        const files = {
            dir,
            ...file
        }
        if ([client.discord.ApplicationCommandType.Message, client.discord.ApplicationCommandType.User].includes(file.type)){
             client.context.set(file.name, file)
             } else {
           client.commands.set(file.name, files);
        }
        commands.push(file)
    });
   const rest = new client.discord.REST().setToken(client.config.token);
   await rest.put(client.discord.Routes.applicationCommands("1315121434112167946"), { body: commands }) 
   client.dbl.postBotCommands(commands);

}
const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
eventFiles.map(async (filePaths) => require(filePaths));
mongoose.set('strictQuery', false); 
mongoose.connect(client.config.mongooseConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on("connected", () => {
 console.log(`Mongoose Database connected to Discoria on Shard ${client.shard.ids}.`)
});
mongoose.connection.on("disconnected", () => {
  console.log(`Mongoose Database disconnected from Discoria on Shard ${client.shard.ids}.`)
});
};
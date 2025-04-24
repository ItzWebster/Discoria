const { model, Schema } = require(`mongoose`);

let boostSchema = new Schema({
    Guild: String,
    Channel: String,
})

module.exports = model(`boostSchema`, boostSchema)
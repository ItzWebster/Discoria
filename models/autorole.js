const { model, Schema } = require(`mongoose`);

let autoroleSchema = new Schema({
    Guild: String,
    Role: String,
})

module.exports = model(`autoroleSchema`, autoroleSchema)
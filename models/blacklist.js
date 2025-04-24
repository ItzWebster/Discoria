const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    ID : String
})

module.exports = mongoose.model('blacklist', Schema)
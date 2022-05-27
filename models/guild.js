const { default: mongoose } = require("mongoose");

const guildSchema = mongoose.Schema({
    id: String,
    durationLimit: String
});

module.exports = mongoose.model('Guild', guildSchema);
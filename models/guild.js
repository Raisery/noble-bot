const { default: mongoose } = require("mongoose");

const guildSchema = mongoose.Schema({
    id: String,
    duration_limit: String,
    ignored_voice_channels: [String]
});

module.exports = mongoose.model('Guild', guildSchema);
const { default: mongoose } = require("mongoose");

const guildSchema = mongoose.Schema({
    id: String,
    durationLimit: String,
    ignoredVC: [String]
});

module.exports = mongoose.model('Guild', guildSchema);
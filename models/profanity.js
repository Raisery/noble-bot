const { default: mongoose } = require("mongoose");

const profanitySchema = mongoose.Schema({
    guildId: String,
    customBadWords: [String],
    punchlines: [String]
});

module.exports = mongoose.model('Profanity',profanitySchema);
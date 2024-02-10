const { default: mongoose } = require("mongoose");

const profanitySchema = mongoose.Schema({
    guild_id: String,
    custom_bad_words: [String],
    punchlines: [String]
});

module.exports = mongoose.model('Profanity',profanitySchema);
const { default: mongoose } = require("mongoose");

const annonceSchema = mongoose.Schema({
    userId: String,
    guildId: String,
    trackUrl: String
});

module.exports = mongoose.model('Annonce', annonceSchema);
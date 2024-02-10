const { default: mongoose } = require('mongoose');

const annonceSchema = mongoose.Schema({
    user_id: String,
    guild_id: String,
    song_id: String,
});

module.exports = mongoose.model('Annonce', annonceSchema);

const { default: mongoose } = require('mongoose');

const songSchema = mongoose.Schema({
    guild_id: String,
    created_at: Date,
    created_by: String,
    duration: Number,
    isTroll: Boolean,
    title: String,
    path: String,
    id: String,
});

module.exports = mongoose.model('Song', songSchema);

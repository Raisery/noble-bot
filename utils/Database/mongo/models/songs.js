import mongoose from 'mongoose';

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

const Song = mongoose.model('Song', songSchema);
export default Song;

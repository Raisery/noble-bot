import mongoose from 'mongoose';

const guildSchema = mongoose.Schema({
    id: String,
    duration_limit: String,
    ignored_voice_channels: [String],
});

const Guild = mongoose.model('Guild', guildSchema);
export default Guild;

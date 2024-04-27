import mongoose from 'mongoose';

const profanitySchema = mongoose.Schema({
    guild_id: String,
    custom_bad_words: [String],
    punchlines: [String],
});

const Profanity = mongoose.model('Profanity', profanitySchema);
export default Profanity;

import mongoose from 'mongoose';

const annonceSchema = mongoose.Schema({
    user_id: String,
    guild_id: String,
    song_path: String,
});
const Annonce = mongoose.model('Annonce', annonceSchema);
export default Annonce;

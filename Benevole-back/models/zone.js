const mongoose = require('mongoose');
const Jeu = require('./jeux');

const zoneSchema = mongoose.Schema({
    nom_zone: { type: String, required: true, unique: true },
    jeux: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jeu', // Référence au modèle Jeu
        required: true
    }],
});


module.exports = mongoose.model('Zone', zoneSchema);
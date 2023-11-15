const mongoose = require('mongoose');
const Jeu = require('./jeux');
const Benevole = require('./benevole');

const zoneSchema = mongoose.Schema({
    nom_zone: { type: String, required: true, unique: true },
    jeux: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jeu', // Référence au modèle Jeu
        required: true
    }],
    nb_benevole: { type: Number, required: true },
    referents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Benevole', // Référence au modèle Benevole
        required: true
    }],
    liste_benevole: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Benevole', // Référence au modèle Benevole
        required: true
    }],
});


module.exports = mongoose.model('Zone', zoneSchema);
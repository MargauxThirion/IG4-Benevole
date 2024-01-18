const mongoose = require('mongoose');
const Jeu = require('./jeux');
const Benevole = require('./benevole');

const zoneBenevoleSchema = mongoose.Schema({
    nom_zone_benevole: { type: String, required: true},
    referents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Benevole', // Référence au modèle Benevole
        required: false
    }],
    id_zone_benevole: { type: String, required: true},
    date: { type: Date, required: true },
    liste_jeux: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jeu', // Référence au modèle Jeu
        required: false
    }],
    horaireCota: [{
        heure: { type: String},
        nb_benevole: { type: Number},
        liste_benevole: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Benevole', // Référence au modèle Benevole
            required: false
        }]
      }]
});
module.exports = mongoose.model('ZoneBenevole', zoneBenevoleSchema);
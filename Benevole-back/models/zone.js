const mongoose = require('mongoose');
const Jeu = require('./jeux');
const Benevole = require('./benevole');

const zoneSchema = mongoose.Schema({
    nom_zone: { type: String, required: true},
    id_zone: { type: String, required: true},
    zone_benevole: { type: Boolean, required: true, default: true },
    referents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Benevole', // Référence au modèle Benevole
        required: false
    }],
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
module.exports = mongoose.model('Zone', zoneSchema);
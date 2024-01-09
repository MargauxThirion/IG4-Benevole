const mongoose = require('mongoose');
const Jeu = require('./jeux');
const Benevole = require('./benevole');

const zoneSchema = mongoose.Schema({
    nom_zone: { type: String, required: true, unique: true },
    id_zone: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    jeux: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jeu', // Référence au modèle Jeu
        required: false
    }],
    horaireCota: [{
        heure: { type: String, required: true },
        nb_benevole: { type: Number},
        liste_benevole: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Benevole', // Référence au modèle Benevole
            required: false
        }]
      }]
});


module.exports = mongoose.model('Zone', zoneSchema);
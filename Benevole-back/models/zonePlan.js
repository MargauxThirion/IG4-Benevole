const mongoose = require('mongoose');
const zoneBelenole = require('./zoneBenevole');

const zonePlanSchema = mongoose.Schema({
    nom_zone_plan: { type: String, required: true},
    liste_zone_benevole: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ZoneBenevole', // Référence au modèle ZoneBenevole
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

module.exports = mongoose.model('ZonePlan', zonePlanSchema);



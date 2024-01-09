const mongoose = require('mongoose');
const Benevole = require('./benevole');

const standsSchema =  mongoose.Schema({
    referents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Benevole', // Référence au modèle Benevole
        required: false
    }],
    nom_stand: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
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

module.exports = mongoose.model('Stands', standsSchema);
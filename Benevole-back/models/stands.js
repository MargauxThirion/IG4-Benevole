const mongoose = require('mongoose');
const Benevole = require('./benevole');

const standsSchema =  mongoose.Schema({
    referents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Benevole', // Référence au modèle Benevole
        required: false
    }],
    liste_benevole: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Benevole', // Référence au modèle Benevole
        required: false
    }],
    nom_stand: { type: String, required: true },
    description: { type: String, required: true },
    horaireCota: [{
        heure: { type: String, required: true },
        nb_benevole: { type: Number, required: true }
      }]
});

module.exports = mongoose.model('Stands', standsSchema);
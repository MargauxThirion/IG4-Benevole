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
    nb_benevole: { type: Number, required: true },
    nom_stand: { type: String, required: true },
    description: { type: String, required: false },
    horaire: { type: String, required: false },
});

module.exports = mongoose.model('Stands', standsSchema);
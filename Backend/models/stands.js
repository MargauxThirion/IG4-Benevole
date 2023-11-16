const mongoose = require('mongoose');
const Benevole = require('./benevole');
const TypeStand = require('./type_stand');

const standsSchema =  mongoose.Schema({
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
    nb_benevole: { type: Number, required: true },
    categorie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TypeStand' // Référence au modèle TypeStand
    },
    horaire: { type: String, required: true },
});

module.exports = mongoose.model('Stands', standsSchema);
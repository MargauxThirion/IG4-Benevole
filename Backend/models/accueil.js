const mongoose = require('mongoose');
const Benevole = require('./benevole');

const accueilSchema =  mongoose.Schema({
    num_accueil: { type: Number, required: true, unique: true },
    description : { type: String, required: true },
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
    horaire: { type: String, required: true },
});

module.exports = mongoose.model('Accueil', accueilSchema);
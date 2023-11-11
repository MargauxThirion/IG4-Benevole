const mongoose = require('mongoose');

const accueilSchema =  mongoose.Schema({
    num_accueil: { type: Number, required: true, unique: true },
    description : { type: String, required: true },
    referents: [{
        type: Schema.Types.ObjectId,
        ref: 'Benevole', // Référence au modèle Benevole
        required: true
    }],
    liste_benevole: [{
        type: Schema.Types.ObjectId,
        ref: 'Benevole', // Référence au modèle Benevole
        required: true
    }],
    nb_benevole: { type: Number, required: true },
    horaire: { type: String, required: true },
});

module.exports = mongoose.model('Accueil', accueilSchema);
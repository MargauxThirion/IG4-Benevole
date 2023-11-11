const mongoose = require('mongoose');

const standsSchema =  mongoose.Schema({
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
    categorie: {
        type: Schema.Types.ObjectId,
        ref: 'TypeStand' // Référence au modèle TypeStand
    },
    horaire: { type: String, required: true },
});

module.exports = mongoose.model('Stands', standsSchema);
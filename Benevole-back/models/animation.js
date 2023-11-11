const mongoose = require('mongoose');

const animationSchema =  mongoose.Schema({
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
    zone: {
        type: Schema.Types.ObjectId,
        ref: 'Zone', // Référence au modèle Zone
        required : true 
    },
    horaire: { type: String, required: true },
});

module.exports = mongoose.model('Animation', animationSchema);
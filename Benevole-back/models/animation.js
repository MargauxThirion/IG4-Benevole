const mongoose = require('mongoose');
const Zone = require('./zone');
const Benevole = require('./benevole');

const animationSchema =  mongoose.Schema({
    nb_benevole: { type: Number, required: true },
    zone: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Zone', // Référence au modèle Zone
        required : true 
    },
    horaire: { type: String, required: true },
});

module.exports = mongoose.model('Animation', animationSchema);
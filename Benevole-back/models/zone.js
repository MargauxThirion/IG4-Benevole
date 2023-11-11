const mongoose = require('mongoose');

const zoneSchema = mongoose.Schema({
    nom_zone: { type: String, required: true, unique: true },
    jeux: [{
        type: Schema.Types.ObjectId,
        ref: 'Jeu', // Référence au modèle Jeu
        required: true
    }],
});


module.exports = mongoose.model('Zone', zoneSchema);
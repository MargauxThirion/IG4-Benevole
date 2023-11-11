const mongoose = require('mongoose');

const benevoleSchema = mongoose.Schema({
    admin: { type: Boolean, required: true, default: false },
    referent: { type: String, required: true, default: false },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    pseudo: { type: String, required: true, unique: true },
    association: { type: String },
    taille_tshirt: { type: String, required: true },
    vegetarien: { type: Boolean, required: true},
    mail : { type: String, required: true },
    hébergement: { type: String},
});

module.exports = mongoose.model('Benevole', benevoleSchema);
const mongoose = require('mongoose');

const benevoleSchema = mongoose.Schema({
    admin: { type: Boolean, default: false },
    referent: { type: Boolean, default: false },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    password : { type: String, required: true},
    pseudo: { type: String, required: true, unique: true },
    association: { type: String, required: true},
    taille_tshirt: { type: String, required: true },
    vegetarien: { type: Boolean, required: true},
    mail : { type: String, required: true },
    hebergement: { type: String},
    adresse: { type: String},
    num_telephone : { type: String},
});

module.exports = mongoose.model('Benevole', benevoleSchema);
const mongoose = require('mongoose');

const jeuSchema = mongoose.Schema({
    nom_jeu: { type: String, required: true, unique: true },
    editeur: { type: String, required: true},
    niveau: { type: String, required: true },
    recu: { type: Boolean, required: true},
    lien: { type: String},
});


module.exports = mongoose.model('Jeu', jeuSchema);
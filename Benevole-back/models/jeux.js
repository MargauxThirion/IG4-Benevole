const mongoose = require('mongoose');

const jeuSchema = mongoose.Schema({
    nom_jeu: { type: String, required: true },
    editeur: { type: String, required: true, unique: true },
    niveau: { type: String, required: true },
    recu: { type: Boolean, required: true},
});


module.exports = mongoose.model('Jeu', jeuSchema);
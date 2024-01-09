const mongoose = require('mongoose');

const jeuSchema = mongoose.Schema({
    nom_jeu: { type: String, required: true, unique: true },
    editeur: { type: String, required: true},
    type: { type: String, required: true},
    ageMin: { type: String},
    duree: { type: String},
    theme: { type: String},
    mecanisme: { type: String},
    tags: { type: String},
    description: { type: String},
    recu: { type: Boolean, required: true},
    nbJoueurs: { type: String},
    animationRequise: { type: String, required: true},
    lien: { type: String},
    logo: { type: String},
});


module.exports = mongoose.model('Jeu', jeuSchema);
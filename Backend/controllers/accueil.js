const Accueil = require('../models/accueil');


exports.createAccueil = (req, res, next) => {
    const accueil = new Accueil({
        num_accueil: req.body.num_accueil,
        description: req.body.description,
        referents: req.body.referents,
        liste_benevole: req.body.liste_benevole,
        nb_benevole: req.body.nb_benevole,
        horaire: req.body.horaire,
    });
    accueil.save()
    .then(() => {res.status(201).json({message: 'Accueil créé !'})})
    .catch((error) => {res.status(400).json({error: error})})
};

exports.getOneAccueil = (req, res, next) => {
    Accueil.findOne({_id: req.params.id})
    .then((accueil) => {res.status(200).json(accueil)})
    .catch((error) => {res.status(404).json({error: error})})
};

exports.modifyAccueil = (req, res, next) => {
    const accueil = new Accueil({
        _id: req.params.id,
        num_accueil: req.body.num_accueil,
        description: req.body.description,
        referents: req.body.referents,
        liste_benevole: req.body.liste_benevole,
        nb_benevole: req.body.nb_benevole,
        horaire: req.body.horaire,
    });
    Accueil.updateOne({_id: req.params.id}, accueil)
    .then(() => {res.status(201).json({message: 'Accueil modifié !'})})
    .catch((error) => {res.status(400).json({error: error})})
};

exports.deleteAccueil = (req, res, next) => {
    Accueil.deleteOne({_id: req.params.id})
    .then(() => {res.status(200).json({message: 'Accueil supprimé !'})})
    .catch((error) => {res.status(400).json({error: error})})
};

exports.getAllAccueil = (req, res, next) => {
    Accueil.find()
    .then((accueils) => {res.status(200).json(accueils)})
    .catch((error) => {res.status(400).json({error: error})})
};
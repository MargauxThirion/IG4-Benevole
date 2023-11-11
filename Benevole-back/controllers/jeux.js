const Jeux = require('../models/jeux');

exports.createJeux = (req, res, next) => {
    const jeux = new Jeux({
        nom: req.body.nom,
        description: req.body.description,
        nb_benevole: req.body.nb_benevole,
        horaire: req.body.horaire,
    });
    jeux.save()
    .then(() => {res.status(201).json({message: 'Jeux créé !'})})
    .catch((error) => {res.status(400).json({error: error})})
};

exports.getOneJeux = (req, res, next) => {
    Jeux.findOne({_id: req.params.id})
    .then((jeux) => {res.status(200).json(jeux)})
    .catch((error) => {res.status(404).json({error: error})})
};

exports.modifyJeux = (req, res, next) => {
    const jeux = new Jeux({
        _id: req.params.id,
        nom: req.body.nom,
        description: req.body.description,
        nb_benevole: req.body.nb_benevole,
        horaire: req.body.horaire,
    });
    Jeux.updateOne({_id: req.params.id}, jeux)
    .then(() => {res.status(201).json({message: 'Jeux modifié !'})})
    .catch((error) => {res.status(400).json({error: error})})
};

exports.deleteJeux = (req, res, next) => {
    Jeux.deleteOne({_id: req.params.id})
    .then(() => {res.status(200).json({message: 'Jeux supprimé !'})})
    .catch((error) => {res.status(400).json({error: error})})
};

exports.getAllJeux = (req, res, next) => {
    Jeux.find()
    .then((jeuxs) => {res.status(200).json(jeuxs)})
    .catch((error) => {res.status(400).json({error: error})})
};
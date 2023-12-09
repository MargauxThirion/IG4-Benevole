const Stands = require('../models/stands');

exports.createStands = (req, res, next) => {
    const { referents, nom_stand, description, categorie, horaireCota } = req.body;

    const stands = new Stands({
        referents,
        nom_stand,
        description,
        categorie,
        horaireCota:horaireCota.map(item => ({
            heure: item.heure,
            nb_benevole: item.nb_benevole
        }))
    });
    stands.save()
    .then(() => {res.status(201).json({message: 'Stands créé !'})})
    .catch((error) => {res.status(400).json({error: error})})
};

exports.getOneStands = (req, res, next) => {
    Stands.findOne({_id: req.params.id})
    .then((stands) => {res.status(200).json(stands)})
    .catch((error) => {res.status(404).json({error: error})})
};

exports.modifyStands = (req, res, next) => {
    const stands = new Stands({
        _id: req.params.id,
        referents: req.body.referents,
        nom_stand: req.body.nom_stand,
        description: req.body.description,
        categorie: req.body.categorie,
        horaireCota: [{
            heure: req.body.heure,
            nb_benevole: req.body.nb_benevole
        }]
    });
    Stands.updateOne({_id: req.params.id}, stands)
    .then(() => {res.status(201).json({message: 'Stands modifié !'})})
    .catch((error) => {res.status(400).json({error: error})})
};

exports.deleteStands = (req, res, next) => {
    Stands.deleteOne({_id: req.params.id})
    .then(() => {res.status(200).json({message: 'Stands supprimé !'})})
    .catch((error) => {res.status(400).json({error: error})})
};

exports.getAllStands = (req, res, next) => {
    Stands.find()
    .then((standss) => {res.status(200).json(standss)})
    .catch((error) => {res.status(400).json({error: error})})
};
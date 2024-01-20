const Zone = require('../models/zone');

exports.createZone = (req, res, next) => {
    const zone = new Zone({
        nom_zone: req.body.nom_zone,
        jeux: req.body.jeux,
    });
    zone.save()
    .then(() => {res.status(201).json({message: 'Zone créée !'})})
    .catch((error) => {res.status(400).json({error: error})})

};

exports.getOneZone = (req, res, next) => {
    Zone.findOne({_id: req.params.id})
    .then((zone) => {res.status(200).json(zone)})
    .catch((error) => {res.status(404).json({error: error})})
};

exports.modifyZone = (req, res, next) => {
    const zone = new Zone({
        _id: req.params.id,
        nom_zone: req.body.nom_zone,
        jeux: req.body.jeux,
    });
    Zone.updateOne({_id: req.params.id}, zone)
    .then(() => {res.status(201).json({message: 'Zone modifiée !'})})
    .catch((error) => {res.status(400).json({error: error})})
};

exports.deleteZone = (req, res, next) => {
    Zone.deleteOne({_id: req.params.id})
    .then(() => {res.status(200).json({message: 'Zone supprimée !'})})
    .catch((error) => {res.status(400).json({error: error})})
};

exports.getAllZone = (req, res, next) => {
    Zone.find()
    .then((zones) => {res.status(200).json(zones)})
    .catch((error) => {res.status(400).json({error: error})})
};

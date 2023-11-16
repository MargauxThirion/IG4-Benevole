const TypeStand = require('../models/type_stand');

exports.createTypeStand = (req, res, next) => {
    const typeStand = new TypeStand({
        nom: req.body.nom,
        description: req.body.description,
    });
    typeStand.save()
    .then(() => {res.status(201).json({message: 'TypeStand créé !'})})
    .catch((error) => {res.status(400).json({error: error})})
};

exports.getOneTypeStand = (req, res, next) => {
    TypeStand.findOne({_id: req.params.id})
    .then((typeStand) => {res.status(200).json(typeStand)})
    .catch((error) => {res.status(404).json({error: error})})
};

exports.modifyTypeStand = (req, res, next) => {
    const typeStand = new TypeStand({
        _id: req.params.id,
        nom: req.body.nom,
        description: req.body.description,
    });
    TypeStand.updateOne({_id: req.params.id}, typeStand)
    .then(() => {res.status(201).json({message: 'TypeStand modifié !'})})
    .catch((error) => {res.status(400).json({error: error})})
};

exports.deleteTypeStand = (req, res, next) => {
    TypeStand.deleteOne({_id: req.params.id})
    .then(() => {res.status(200).json({message: 'TypeStand supprimé !'})})
    .catch((error) => {res.status(400).json({error: error})})
};

exports.getAllTypeStand = (req, res, next) => {
    TypeStand.find()
    .then((typeStands) => {res.status(200).json(typeStands)})
    .catch((error) => {res.status(400).json({error: error})})
};
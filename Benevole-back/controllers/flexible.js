const Flexible = require('../models/flexible');
const Benevole = require('../models/benevole');
const Stands = require('../models/stands');

exports.createFlexible = (req, res, next) => {
    const {benevole_id, horaire} = req.body;
    console.log(req.body);
    const flexible = new Flexible({
        benevole_id,
        horaire: horaire.map((item) => ({
            date,
            heure: item.heure,
            liste_stand: [],
        })),
    });
    flexible.save()
    .then(() => {
        res.status(201).json({message: 'Flexible créé !'});
    })
    .catch((error) => {
        res.status(400).json({error: error});
    });
};

exports.getOneFlexible = (req, res, next) => {
    Flexible.findOne({_id: req.params.id})
    .populate('benevole_id', 'pseudo')
    .populate('horaire.liste_stand', 'nom_stand')
    .then((flexible) => {
        res.status(200).json(flexible);
    })
    .catch((error) => {
        res.status(404).json({error: error});
    });
};

exports.getFlexibleByBenevole = (req, res, next) => {
    Flexible.find({benevole_id: req.params.id})
    .populate('benevole_id', 'pseudo')
    .populate('horaire.liste_stand', 'nom_stand')
    .then((flexible) => {
        res.status(200).json(flexible);
    })
    .catch((error) => {
        res.status(404).json({error: error});
    });
};

exports.getAllFlexible = (req, res, next) => {
    Flexible.find()
    .populate('benevole_id', 'pseudo')
    .populate('horaire.liste_stand', 'nom_stand')
    .then((flexible) => {res.status(200).json(flexible)})
    .catch((error) => {res.status(400).json({error: error})})
};
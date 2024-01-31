const Flexible = require('../models/flexible');
const Benevole = require('../models/benevole');
const Stands = require('../models/stands');

exports.createFlexible = (req, res, next) => {
    const {benevole_id, horaire} = req.body;
    console.log(req.body);
    horaire.forEach((horaireItem) => {
        console.log("Date:", horaireItem.date, "Heure:", horaireItem.heure);
        console.log("Liste des stands pour cet horaire:");
        horaireItem.liste_stand.forEach(standId => {
            console.log(standId); // Afficher l'identifiant du stand
        });
    });
    const flexible = new Flexible({
        benevole_id,
        horaire: horaire.map((item) => ({
            date: item.date,
            heure: item.heure,
            liste_stand:item.liste_stand,
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
    .populate('horaire.liste_stand', 'id_stand')
    .then((flexible) => {
        res.status(200).json(flexible);
    })
    .catch((error) => {
        res.status(404).json({error: error});
    });
};

exports.getFlexibleByBenevole = (req, res, next) => {
    Flexible.findOne({benevole_id: req.params.id})
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

exports.removeAllFlexible = (req, res, next) => {
    Flexible.deleteMany()
    .then(() => {res.status(200).json({message: 'Flexible supprimés !'})})
    .catch((error) => {res.status(400).json({error: error})})
};
exports.removeOneFlexibleById = async (req, res) => {
    try {
        const result = await Flexible.deleteOne({ _id: req.params.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Flexible non trouvé" });
        }

        res.status(200).json({ message: "Flexible supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du flexible", error: error.message });
    }
};



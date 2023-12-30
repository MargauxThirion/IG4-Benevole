const Festival = require('../models/festival');

exports.createFestival = (req, res, next) => {
    const {nom, lieu, description, date_debut, date_fin } = req.body;

    const festival = new Festival({
        nom,
        lieu,
        description,
        date_debut,
        date_fin
    });

    festival.save()
    .then(() => {
        res.status(201).json({ message: 'Festival créé !' });
    })
    .catch((error) => {
        res.status(400).json({ error: error });
    });
};

exports.getAllFestival = (req, res, next) => {
    Festival.find()
    .then((festival) => {res.status(200).json(festival)})
    .catch((error) => {res.status(400).json({error: error})})
}

exports.getOneFestival = (req, res, next) => {
    Festival.findOne({_id: req.params.id})
    .then((festival) => {res.status(200).json(festival)})
    .catch((error) => {res.status(404).json({error: error})})
};

exports.getLatestFestival = (req, res, next) => {
    // Trouvez tous les festivals, triez-les par date_fin en ordre décroissant et prenez le premier
    Festival.findOne().sort({ date_fin: -1 })
    .then((festival) => {
        if (festival) {
            res.status(200).json(festival);
        } else {
            res.status(404).json({ message: 'Aucun festival trouvé' });
        }
    })
    .catch((error) => {
        res.status(500).json({ error: error });
    });
};

exports.modifyFestival = async (req, res) => {
    try {
        const festivalId = req.params.id;
        const updates = req.body;

        // Mettre à jour le festivale avec les données fournies dans req.body
        const updatedFestival = await Festival.findByIdAndUpdate(
            festivalId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedFestival) {
            return res.status(404).json({ message: 'Festival non trouvé' });
        }

        res.status(200).json({ message: 'Festival modifié!', festival: updatedFestival });
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la modification du festival', error);
        res.status(500).json({ error: 'Une erreur s\'est produite lors de la modification du festival' });
    }
};

exports.deleteFestival = (req, res, next) => {
    Festival.deleteOne({_id: req.params.id})
    .then(() => {res.status(200).json({message: 'Festival supprimé !'})})
    .catch((error) => {res.status(400).json({error: error})})
};
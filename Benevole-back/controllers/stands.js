const Stands = require('../models/stands');
exports.createStands = (req, res, next) => {
    const { referents, nom_stand, description, horaireCota } = req.body;

    const stands = new Stands({
        referents,
        nom_stand,
        description,
        horaireCota: horaireCota.map(item => ({
            heure: item.heure,
            nb_benevole: item.nb_benevole,
            liste_benevole: [] // Initialiser liste_benevole à un tableau vide pour chaque horaire
        }))
    });

    stands.save()
    .then(() => {
        res.status(201).json({ message: 'Stands créé !' });
    })
    .catch((error) => {
        res.status(400).json({ error: error });
    });
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
        horaireCota: [{
            heure: req.body.heure,
            nb_benevole: req.body.nb_benevole,
            liste_benevole: []
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

exports.addBenevoleToHoraire = (req, res, next) => {
    const { idHoraire, idBenevole } = req.params; // Identifiant de l'horaire et du bénévole
    Stands.findOneAndUpdate(
        { "horaireCota._id": idHoraire }, // Recherche de l'horaire spécifique dans la collection
        { $addToSet: { "horaireCota.$.liste_benevole": idBenevole } }, // Ajout du bénévole à liste_benevole de cet horaire
        { new: true }
    )
    .then((stand) => {
        if (!stand) {
            return res.status(404).json({ message: 'Horaire non trouvé' });
        }
        res.status(200).json({ message: 'Bénévole ajouté à l\'horaire avec succès' });
    })
    .catch((error) => {
        res.status(400).json({ error: error });
    });
};

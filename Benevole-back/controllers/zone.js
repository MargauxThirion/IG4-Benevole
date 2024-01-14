const Zone = require('../models/zone');
const Jeu = require('../models/jeux');
const Benevole = require('../models/benevole');
const xlsx = require('xlsx');
const benevole = require('../models/benevole');

exports.importZoneFromExcelJour1 = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const { date } = req.body;

    try {
        const workbook = xlsx.readFile(req.file.path);
        const sheetNames = workbook.SheetNames;
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
        
        await Zone.deleteMany({});
        
        const uniqueIdZones = new Set();
        const zonesPromises = [];
        for (const data of sheetData) {
            const idZone = data['idZone'];
            let nomZone = data['Zone bénévole'];
            let zone_benevole = true;
            if (!nomZone) {
                nomZone = data['Zone plan'];
                zone_benevole = false;
            }
            const uniqueKey = `${idZone}_${nomZone}_${date}`;
        

            if (!uniqueIdZones.has(uniqueKey)) {
                uniqueIdZones.add(uniqueKey); 
                const newZone = new Zone({
                    id_zone: idZone,
                    nom_zone: nomZone,
                    zone_benevole: zone_benevole,
                    date: date,
                });
                zonesPromises.push(newZone.save());
                console.log(`Zone créée: ${nomZone} pour la date: ${date}`);
            } else {
                console.log(`Doublon ignoré: ${nomZone}`);
            }
            console.log("toutes zone importer pour le jour 1");
        }

        await Promise.all(zonesPromises);
        res.status(201).json({ message: 'Toutes les zones ont été créées' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'importation des zones', error });
    }
};


exports.importZoneFromExcelJour2 = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const { date } = req.body;

    try {
        const workbook = xlsx.readFile(req.file.path);
        const sheetNames = workbook.SheetNames;
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
        
        const uniqueIdZones = new Set();
        const zonesPromises = [];
        for (const data of sheetData) {
            const idZone = data['idZone'];
            let nomZone = data['Zone bénévole'];
            let zone_benevole = true;
            if (!nomZone) {
                nomZone = data['Zone plan'];
                zone_benevole = false;
            }
            const uniqueKey = `${idZone}_${nomZone}_${date}`;
        

            if (!uniqueIdZones.has(uniqueKey)) {
                uniqueIdZones.add(uniqueKey); 
                const newZone = new Zone({
                    id_zone: idZone,
                    nom_zone: nomZone,
                    zone_benevole: zone_benevole,
                    date: date,
                });
                zonesPromises.push(newZone.save());
                console.log(`Zone créée: ${nomZone} pour la date: ${date}`);
            } else {
                console.log(`Doublon ignoré: ${nomZone}`);
            }
        }

        await Promise.all(zonesPromises);
        res.status(201).json({ message: 'Toutes les zones ont été créées' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'importation des zones', error });
    }
};


exports.addHorairesToZone = async (req, res, next) => {
    const { horaireCota } = req.body;

    try {
        const horairesToUpdate = horaireCota.map(item => ({
            heure: item.heure,
            nb_benevole: item.nb_benevole,
            liste_benevole: [],
        }));

        await Zone.updateMany({}, { $set: { horaireCota: horairesToUpdate } });
        res.status(200).json({ message: 'Horaires mis à jour pour toutes les zones' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

exports.addJeuxToZone = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const workbook = xlsx.readFile(req.file.path);
        const sheetNames = workbook.SheetNames;
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);

        const gamesPromises = [];
        for (const data of sheetData) {
            const nom_jeu = data['Nom du jeu'];
            const idZone = data['idZone']; // Vous devez adapter cette partie en fonction de la structure de votre fichier Excel

            const jeu = await Jeu.findOne({ nom_jeu: nom_jeu });
            if (jeu) {
                const zone = await Zone.findOne({ id_zone: idZone }); // Vous devez adapter cette partie en fonction de la structure de votre fichier Excel
                if (zone) {
                    zone.liste_jeux.push(jeu._id);
                    await zone.save();
                }
            }
        }
        res.status(201).json({ message: 'Les jeux ont été associés aux zones' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'association des jeux aux zones', error });
    }
};

exports.getOneZone = (req, res, next) => {
    Zone.findOne({_id: req.params.id})
    .then((zone) => {res.status(200).json(zone)})
    .catch((error) => {res.status(404).json({error: error})})
};

exports.getZonesByDate = (req, res, next) => {
    Zone.find({ date: req.params.date })
    .populate("referents", "pseudo")
    .populate("horaireCota.liste_benevole", "pseudo")
    .then((zone) => {
        res.status(200).json(zone);
    })
    .catch((error) => {
        res.status(404).json({ error: error });
    });
};


exports.modifyZone = (req, res, next) => {
    try {
        const zoneId = req.params.id;
        const updates = req.body;
        const updatedZone = Zone.findByIdAndUpdate(
            zoneId, 
            { $set: updates }, 
            { new: true, runValidators: true }
        );
        if (!updatedZone) {
            return res.status(404).json({ message: 'Zone non trouvée' });
        }
        res.status(200).json({ message: 'Zone modifiée!', zone: updatedZone });
    } catch (error) {
        console.error("Une erreur s'est produite lors de la modification de la zone", error);
        res.status(500).json({ error: "Une erreur s'est produite lors de la modification de la zone" });
    }
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

exports.getZonesByDate = (req, res, next) => {
    Zone.find({ date: req.params.date })
    .then((zones) => {res.status(200).json(zones)})
    .catch((error) => {res.status(400).json({error: error})})
};

exports.addBenevoleToHoraire = async (req, res, next) => {
    const { benevoleId, horaireId } = req.body;
    Zone.findOneAndUpdate(
        { "horaireCota._id": horaireId },
        { $addToSet: { "horaireCota.$.liste_benevole": benevoleId } },
        { new: true }
    )
    .then((zone) => {
        if (!zone) {
            return res.status(404).json({ message: 'Zone non trouvée' });
        }
        res.status(200).json({ message: 'Bénévole ajouté à la zone', zone });
    })
    .catch((error) => {
        console.error("Une erreur s'est produite lors de l'ajout du bénévole à la zone", error);
        res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du bénévole à la zone" });
    });
};

exports.addReferentToZone = async (req, res, next) => {
    const { benevoleId, zoneId } = req.params;
    Zone.findById(benevoleId)
    .then ((zone) => {
        if (!zone) {
            return res.status(404).json({ message: 'Zone non trouvée' });
        }
        return Zone.findOneAndUpdate(
            { _id: zoneId },
            { $addToSet: { referents: benevoleId } },
            { new: true, runValidators: true }
        ).then((zone) => {
            if (!zone) {
                return res.status(404).json({ message: 'Zone non trouvée' });
            }
            return Benevole.findOneAndUpdate(
                { _id: benevoleId },
                { $addToSet: { zones: zoneId } },
                { new: true, runValidators: true }
            ).then(() => {
                return zone;
            });
        });
    })
    .then((zone) => {
        res.status(200).json({ 
            message: 'Référent ajouté à la zone', 
            zone: zone, });
    })
    .catch((error) => {
        console.error("Une erreur s'est produite lors de l'ajout du référent à la zone", error);
        res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du référent à la zone" });
    });
};

exports.removeReferentFromZone = async (req, res, next) => {
    try {
        const { referentId, zoneId } = req.params;
        const zone = await Zone.findById(zoneId);
        if (!zone) {
            return res.status(404).json({ message: 'Zone non trouvée' });
        }

        const referentIndex = zone.referents.indexOf(referentId);
        if (referentIndex === -1) {
            return res
            .status(404)
            .json({ message: 'Référent non trouvé' });
        }

        zone.referents.splice(referentIndex, 1);
        await Benevole.findByIdAndUpdate(referentId, { referent: false });
        await zone.save();
        res.status(200).json({ message: 'Référent supprimé de la zone avec succès' });
    } catch (error) {
        console.error("Une erreur s'est produite lors de la suppression du référent de la zone", error);
        res.status(500).json({ error: "Une erreur s'est produite lors de la suppression du référent de la zone" });
    }
};


exports.getByZoneBenevole = (req, res, next) => {
    Zone.find({ zone_benevole: true })
    .then((zones) => {res.status(200).json(zones)})
    .catch((error) => {res.status(400).json({error: error})})
}

exports.getByZonePlan = (req, res, next) => {
    Zone.find({ zone_benevole: false })
    .then((zones) => {res.status(200).json(zones)})
    .catch((error) => {res.status(400).json({error: error})})
}


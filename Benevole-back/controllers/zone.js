const Zone = require('../models/zone');
const Jeu = require('../models/jeux');
const xlsx = require('xlsx');

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

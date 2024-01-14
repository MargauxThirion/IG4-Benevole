const ZonePlan = require('../models/zonePlan');
const Jeu = require('../models/jeux');
const xlsx = require('xlsx');
const ZoneBenevole = require('../models/zoneBenevole');

exports.importZoneFromExcelJour1 = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const { date } = req.body;

    try {
        const workbook = xlsx.readFile(req.file.path);
        const sheetNames = workbook.SheetNames;
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);

        await ZonePlan.deleteMany({ date: date });
        
        const zoneBenevoleMap = {};
        for (const data of sheetData) {
            const nomZonePlan = data['Zone plan'];
            const nomZoneBenevole = data['Zone bénévole'];

            if (nomZoneBenevole) {
                const zoneBenevole = await ZoneBenevole.findOne({ nom_zone_benevole: nomZoneBenevole, date: date });
                if (zoneBenevole) {
                    if (!zoneBenevoleMap[nomZonePlan]) {
                        zoneBenevoleMap[nomZonePlan] = new Set();
                    }
                    zoneBenevoleMap[nomZonePlan].add(zoneBenevole._id.toString());
                }
            } else {
                if (!zoneBenevoleMap[nomZonePlan]) {
                    zoneBenevoleMap[nomZonePlan] = new Set();
                }
            }
        }

        const zonesPromises = Object.entries(zoneBenevoleMap).map(async ([nomZonePlan, zoneBenevoleIds]) => {
            let zonePlan = await ZonePlan.findOne({ nom_zone_plan: nomZonePlan, date: date });
            if (!zonePlan) {
                zonePlan = new ZonePlan({ nom_zone_plan: nomZonePlan, date: date });
            }
            zonePlan.liste_zone_benevole = Array.from(zoneBenevoleIds);
            return zonePlan.save();
        });

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
        
        const zoneBenevoleMap = {};
        for (const data of sheetData) {
            const nomZonePlan = data['Zone plan'];
            const nomZoneBenevole = data['Zone bénévole'];

            if (nomZoneBenevole) {
                const zoneBenevole = await ZoneBenevole.findOne({ nom_zone_benevole: nomZoneBenevole, date: date });
                if (zoneBenevole) {
                    if (!zoneBenevoleMap[nomZonePlan]) {
                        zoneBenevoleMap[nomZonePlan] = new Set();
                    }
                    zoneBenevoleMap[nomZonePlan].add(zoneBenevole._id.toString());
                }
            } else {
                if (!zoneBenevoleMap[nomZonePlan]) {
                    zoneBenevoleMap[nomZonePlan] = new Set();
                }
            }
        }

        const zonesPromises = Object.entries(zoneBenevoleMap).map(async ([nomZonePlan, zoneBenevoleIds]) => {
            let zonePlan = await ZonePlan.findOne({ nom_zone_plan: nomZonePlan, date: date });
            if (!zonePlan) {
                zonePlan = new ZonePlan({ nom_zone_plan: nomZonePlan, date: date });
            }
            zonePlan.liste_zone_benevole = Array.from(zoneBenevoleIds);
            return zonePlan.save();
        });

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

        await ZonePlan.updateMany({}, { $set: { horaireCota: horairesToUpdate } });
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

        for (const data of sheetData) {
            const nom_jeu = data['Nom du jeu'];
            const nom_zone_plan = data['Zone plan'];

            const jeu = await Jeu.findOne({ nom_jeu: nom_jeu });
            if (jeu) {
                console.log("Jeu trouvé :", nom_jeu);

                const zones = await ZonePlan.find({ nom_zone_plan: nom_zone_plan });
                if (zones && zones.length > 0) {
                    zones.forEach(async (zone) => {
                        if (!zone.liste_jeux.includes(jeu._id)) {
                            zone.liste_jeux.push(jeu._id);
                            await zone.save();
                        } else {
                            console.log("Le jeu est déjà dans la liste de cette zone");
                        }
                    });
                } else {
                    console.log("Aucune zone trouvée pour le nom :", nom_zone_plan);
                }
            } else {
                console.log("Jeu non trouvé pour le nom :", nom_jeu);
            }
        }
        res.status(201).json({ message: 'Les jeux ont été associés aux zones' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'association des jeux aux zones', error });
    }
};



exports.getOneZone = (req, res, next) => {
    ZonePlan.findOne({ _id: req.params.id })
        .populate('liste_jeux', 'nom_jeu')
        .then((zone) => { res.status(200).json(zone) })
        .catch((error) => { res.status(404).json({ error: error }) })
};

exports.getAllZone = (req, res, next) => {
    ZonePlan.find()
        .populate('liste_jeux', 'nom_jeu')
        .then((zone) => { res.status(200).json(zone) })
        .catch((error) => { res.status(400).json({ error: error }) })
};

exports.getNomsZonesBenevoles = async (req, res) => {
    try {
      const zonePlanId = req.params.zonePlanId;
      const zonePlan = await ZonePlan.findById(zonePlanId).populate('liste_zone_benevole');
  
      if (!zonePlan) {
        return res.status(404).json({ message: 'Zone Plan non trouvée' });
      }
  
      const nomsZonesBenevoles = zonePlan.liste_zone_benevole.map(zoneBenevole => zoneBenevole.nom_zone_benevole);
  
      res.status(200).json(nomsZonesBenevoles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la récupération des noms des zones bénévoles', error });
    }
  };
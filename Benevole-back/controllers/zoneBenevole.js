const ZoneBenevole = require("../models/zoneBenevole");
const Jeu = require("../models/jeux");
const Benevole = require("../models/benevole");
const Festival = require("../models/festival");
const xlsx = require("xlsx");

exports.importZoneFromExcelJour1 = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { date } = req.body;

  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetNames = workbook.SheetNames;
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);

    await ZoneBenevole.deleteMany({});

    const uniqueIdZones = new Set();
    const zonesPromises = [];
    for (const data of sheetData) {
      const idZone = data["idZone"];
      let nomZone = data["Zone bénévole"] ? data["Zone bénévole"].trim() : ""; // Utilisez trim() pour enlever les espaces
      const nomZonePlan = data["Zone plan"] ? data["Zone plan"].trim() : ""; // Pareil pour zonePlan

      // Si nomZone est vide, utiliser nomZonePlan à la place
      if (!nomZone && nomZonePlan) {
        nomZone = nomZonePlan;
      }

      const uniqueKey = `${idZone}_${nomZone}_${date}`;

      if (!uniqueIdZones.has(uniqueKey) && nomZone) {
        uniqueIdZones.add(uniqueKey);
        const newZone = new ZoneBenevole({
          id_zone_benevole: idZone,
          nom_zone_benevole: nomZone,
          date: date,
        });
        zonesPromises.push(newZone.save());
        console.log(`ZoneBenevole créée: ${nomZone} pour la date: ${date}`);
      } else {
        console.log(`Nom de zone vide ou doublon ignoré: ${nomZone}`);
      }
    }

    await Promise.all(zonesPromises);
    res.status(201).json({ message: "Toutes les zones ont été créées" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'importation des zones", error });
  }
};

exports.importZoneFromExcelJour2 = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { date } = req.body;

  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetNames = workbook.SheetNames;
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
    const uniqueIdZones = new Set();
    const zonesPromises = [];
    for (const data of sheetData) {
      const idZone = data["idZone"];
      let nomZone = data["Zone bénévole"] ? data["Zone bénévole"].trim() : ""; // Utilisez trim() pour enlever les espaces
      const nomZonePlan = data["Zone plan"] ? data["Zone plan"].trim() : ""; // Pareil pour zonePlan

      // Si nomZone est vide, utiliser nomZonePlan à la place
      if (!nomZone && nomZonePlan) {
        nomZone = nomZonePlan;
      }

      const uniqueKey = `${idZone}_${nomZone}_${date}`;

      if (!uniqueIdZones.has(uniqueKey) && nomZone) {
        uniqueIdZones.add(uniqueKey);
        const newZone = new ZoneBenevole({
          id_zone_benevole: idZone,
          nom_zone_benevole: nomZone,
          date: date,
        });
        zonesPromises.push(newZone.save());
        console.log(`ZoneBenevole créée: ${nomZone} pour la date: ${date}`);
      } else {
        console.log(`Nom de zone vide ou doublon ignoré: ${nomZone}`);
      }
    }

    await Promise.all(zonesPromises);
    res.status(201).json({ message: "Toutes les zones ont été créées" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'importation des zones", error });
  }
};

exports.addHorairesToZone = async (req, res, next) => {
  const { horaireCota } = req.body;

  try {
    const horairesToUpdate = horaireCota.map((item) => ({
      heure: item.heure,
      nb_benevole: item.nb_benevole,
      liste_benevole: [],
    }));

    await ZoneBenevole.updateMany(
      {},
      { $set: { horaireCota: horairesToUpdate } }
    );
    res
      .status(200)
      .json({ message: "Horaires mis à jour pour toutes les zones" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

exports.addJeuxToZone = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetNames = workbook.SheetNames;
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);

    const gamesPromises = [];
    for (const data of sheetData) {
      const nom_jeu = data["Nom du jeu"];
      const idZone = data["idZone"]; // Vous devez adapter cette partie en fonction de la structure de votre fichier Excel

      const jeu = await Jeu.findOne({ nom_jeu: nom_jeu });
      if (jeu) {
        const zone = await ZoneBenevole.findOne({ id_zone_benevole: idZone }); // Vous devez adapter cette partie en fonction de la structure de votre fichier Excel
        if (zone) {
          zone.liste_jeux.push(jeu._id);
          await zone.save();
        }
      }
    }
    res
      .status(201)
      .json({ message: "Les jeux ont été associés aux zones Benevole" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Erreur lors de l'association des jeux aux zones",
        error,
      });
  }
};

exports.getOneZone = (req, res, next) => {
  ZoneBenevole.findOne({ _id: req.params.id })
    .then((zone) => {
      res.status(200).json(zone);
    })
    .catch((error) => {
      res.status(404).json({ error: error });
    });
};

exports.getZonesByDate = (req, res, next) => {
  ZoneBenevole.find({ date: req.params.date })
    .populate("referents", "pseudo")
    .populate("horaireCota.liste_benevole", "pseudo")
    .then((zone) => {
      res.status(200).json(zone);
    })
    .catch((error) => {
      res.status(404).json({ error: error });
    });
};

exports.getZoneByBothDate = async (req, res, next) => {
  try {
    const festival = await Festival.findOne().sort({ date: -1 })
    if (!festival) {
      throw new Error("Festival non trouvé");
    }
    const zones = await ZoneBenevole.find();

    const festivalDateDebutStr = festival.date_debut.toISOString().split('T')[0];
    const festivalDateFinStr = festival.date_fin.toISOString().split('T')[0];

    const zoneMap = new Map();
    zones.forEach(zone => {
      const zoneDateStr = zone.date.toISOString().split('T')[0];
      if(!zoneMap.has(zone.nom_zone_benevole)) {
        zoneMap.set(zone.nom_zone_benevole, [zoneDateStr]);
      } else {
        const dates = zoneMap.get(zone.nom_zone_benevole);
        if (!dates.includes(zoneDateStr)) {
          dates.push(zoneDateStr);
        }
      }
    });

    const zoneAvailableBothDate  = Array.from(zoneMap)
    .filter(([_, dates]) => dates.includes(festivalDateDebutStr) && dates.includes(festivalDateFinStr))
    .map(([nom_zone_benevole, _]) =>{
      return zones.filter(zone => zone.nom_zone_benevole === nom_zone_benevole);
    });

    res.status(200).json(zoneAvailableBothDate.flat());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


exports.modifyZone = async (req, res) => {
  const zoneId = req.params.id;
  const updates = req.body;
  
  try {
    const updatedZone = await ZoneBenevole.findByIdAndUpdate(
      zoneId, 
      { $set: updates },
      { new: true, runValidators: true }
    )

    if (!updatedZone) {
      return res.status(404).json({ message: "ZoneBenevole non trouvée" });
    }
    
    res.status(200).json({ message: "ZoneBenevole modifiée avec succès!", zone: updatedZone });
  } catch (error) {
    console.error("Erreur lors de la modification de la ZoneBenevole", error);
    res.status(500).json({ error: "Erreur lors de la modification de la ZoneBenevole" });
  }
};

exports.deleteZone = (req, res, next) => {
  ZoneBenevole.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({ message: "Zone supprimée !" });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.getAllZone = (req, res, next) => {
  ZoneBenevole.find()
    .then((zones) => {
      res.status(200).json(zones);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.getZonesByDate = (req, res, next) => {
  ZoneBenevole.find({ date: req.params.date })
    .then((zones) => {
      res.status(200).json(zones);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.addBenevoleToHoraire = async (req, res, next) => {
  const { benevoleId, horaireId } = req.body;
  ZoneBenevole.findOneAndUpdate(
    { "horaireCota._id": horaireId },
    { $addToSet: { "horaireCota.$.liste_benevole": benevoleId } },
    { new: true }
  )
    .then((zone) => {
      if (!zone) {
        return res.status(404).json({ message: "Zone non trouvée" });
      }
      res.status(200).json({ message: "Bénévole ajouté à la zone", zone });
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de l'ajout du bénévole à la zone",
        error
      );
      res
        .status(500)
        .json({
          error:
            "Une erreur s'est produite lors de l'ajout du bénévole à la zone",
        });
    });
};

exports.addReferentToZoneBenevole = (req, res, next) => {
  const { idZoneBenevole, benevoleId } = req.params;

  Benevole.findById(benevoleId)
    .then((benevole) => {
      if (!benevole) {
        throw new Error("Bénévole non trouvé");
      }
      return ZoneBenevole.findOneAndUpdate(
        { _id: idZoneBenevole },
        { $addToSet: { referents: benevoleId } },
        { new: true, runValidators: true }
      ).then((zone) => {
        if (!zone) {
          throw new Error("Zone non trouvée");
        }
        return Benevole.findOneAndUpdate(
          { _id: benevoleId },
          { $set: { referent: true } },
          { new: true, runValidators: true }
        ).then(() => {
          return zone;
        });
      });
    })
    .then((zone) => {
      res.status(200).json({
        message: "Référent ajouté à la zone avec succès",
        idZoneBenevole: zone._id,
        zoneName: zone.nom_zone_benevole
      });
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

exports.removeReferentFromZoneBenevole = async (req, res) => {
  try {
    const { idZoneBenevole, referentId } = req.params;

    // Vérifiez d'abord si la zone plan existe
    const zoneBenevole = await ZoneBenevole.findById(idZoneBenevole);
    if (!zoneBenevole) {
      return res.status(404).json({ message: "Zone benevole non trouvée" });
    }

    // Vérifiez si le référent existe dans la liste des référents de la zone plan
    const referentIndex = zoneBenevole.referents.indexOf(referentId);
    if (referentIndex === -1) {
      return res
        .status(404)
        .json({ message: "Référent non trouvé dans la zone benevole" });
    }

    // Supprimez le référent de la zone plan
    zoneBenevole.referents.splice(referentIndex, 1);

    // Mettez à jour le statut de référent du bénévole à false
    await Benevole.findByIdAndUpdate(referentId, { referent: false });

    // Enregistrez les modifications apportées à la zone plan
    await zoneBenevole.save();

    res.status(200).json({ message: "Référent supprimé de la zone bénévole avec succès" });
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la suppression du référent de la zone bénévole :",
      error
    );
    res
      .status(500)
      .json({
        error:
          "Une erreur s'est produite lors de la suppression du référent de la zone bénévole.",
      });
  }
};

async function trouverOuCreerZoneBenevole(nomZoneBenevole, idZone, date) {
  // Rechercher la zone bénévole par son nom ou son ID
  let zoneBenevole = await ZoneBenevole.findOne({
    nom_zone_benevole: nomZoneBenevole,
    id_zone_benevole: idZone,
    date: date,
  });

  // Si elle n'existe pas, créez-en une nouvelle
  if (!zoneBenevole) {
    zoneBenevole = new ZoneBenevole({
      nom_zone_benevole: nomZoneBenevole,
      id_zone_benevole: idZone,
      date: date,
      // Autres propriétés si nécessaire
    });

    await ZoneBenevole.save();
  }

  return ZoneBenevole;
};


exports.trouverZoneParJeuId = async (req, res) => {
  const jeuId = req.params.jeuId;

  try {
      // Trouver la zone qui contient l'ID du jeu dans sa liste de jeux
      const zone = await ZoneBenevole.findOne({ liste_jeux: jeuId }).populate('liste_jeux', 'nom_jeu');

      if (!zone) {
          return res.status(404).json({ message: "Aucune zone trouvée pour ce jeu" });
      }

      // Renvoyer le nom de la zone trouvée
      res.status(200).json({ nom_zone: zone.nom_zone_benevole, jeux: zone.liste_jeux });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la recherche de la zone pour le jeu", error });
  }
};

exports.getJeuxByZone = async (req, res) => {
  try {
    // Récupérez l'ID de la zone à partir des paramètres de la requête
    const { idZone } = req.params;

    // Trouvez la zone et peuplez la liste complète des jeux
    const zoneWithJeux = await ZoneBenevole.findById(idZone)
      .populate('liste_jeux') // Retirer le deuxième argument pour obtenir tous les champs
      .exec();

    // Vérifiez si la zone a été trouvée
    if (!zoneWithJeux) {
      return res.status(404).json({ message: 'Zone not found' });
    }

    // Répondez avec les jeux associés à la zone, incluant tous leurs attributs
    res.status(200).json(zoneWithJeux.liste_jeux);
  } catch (error) {
    console.error('Error fetching games by zone:', error);
    res.status(500).json({ message: 'Error fetching games by zone', error });
  }
};
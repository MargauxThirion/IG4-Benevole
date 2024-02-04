const FlexibleZone = require("../models/flexibleZone");
const Benevole = require("../models/benevole");
const ZoneBenevole = require("../models/zoneBenevole");

exports.createFlexibleZone = (req, res, next) => {
  const { benevole_id, horaire } = req.body;

  // Affichage des horaires pour le débogage
  horaire.forEach((horaireItem) => {
    console.log("Date:", horaireItem.date, "Heure:", horaireItem.heure);
    console.log("Liste des stands pour cet horaire:");
    horaireItem.liste_zoneBenevole.forEach((zoneBenevoleId) => {
      console.log(zoneBenevoleId); // Afficher l'identifiant du stand
    });
  });

  // Rechercher une instance FlexibleZone existante pour ce bénévole
  FlexibleZone.findOneAndUpdate(
    { benevole_id: benevole_id }, // Critères de recherche
    {
      $set: {
        horaire: horaire.map((item) => ({
          date: item.date,
          heure: item.heure,
          liste_zoneBenevole: item.liste_zoneBenevole,
        })),
      },
    },
    { new: true, upsert: true } // Options : retourner le document modifié et créer s'il n'existe pas
  )
    .then((flexibleZone) => {
      if (flexibleZone) {
        res
          .status(200)
          .json({
            message: "FlexibleZone créé ou mis à jour avec succès !",
            data: flexibleZone,
          });
      } else {
        res
          .status(404)
          .json({
            message:
              "FlexibleZone non trouvé et non créé pour une raison inconnue.",
          });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};

exports.getOneFlexibleZone = (req, res, next) => {
  FlexibleZone.findOne({ _id: req.params.id })
    .populate("benevole_id", "pseudo")
    .populate("horaire.liste_zoneBenevole", "id_zoneBenevole")
    .then((flexibleZone) => {
      res.status(200).json(flexibleZone);
    })
    .catch((error) => {
      res.status(404).json({ error: error });
    });
};

exports.getFlexibleZoneByBenevole = (req, res, next) => {
  FlexibleZone.findOne({ benevole_id: req.params.id })
    .populate("benevole_id", "pseudo")
    .populate("horaire.liste_zoneBenevole", "nom_zone_benevole")
    .then((flexibleZone) => {
      res.status(200).json(flexibleZone);
    })
    .catch((error) => {
      res.status(404).json({ error: error });
    });
};

exports.getAllFlexibleZone = (req, res, next) => {
  FlexibleZone.find()
    .populate("benevole_id", "pseudo")
    .populate("horaire.liste_zoneBenevole", "nom_zone_benevole")
    .then((flexibleZone) => {
      res.status(200).json(flexibleZone);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.removeAllFlexibleZone = (req, res, next) => {
  FlexibleZone.deleteMany()
    .then(() => {
      res.status(200).json({ message: "FlexibleZone supprimés !" });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.removeOneFlexibleZoneById = async (req, res) => {
  try {
    // Récupération de l'ID du flexibleZone et de la date depuis les paramètres de la requête
    const { idFlexibleZone, date } = req.params;

    // Mise à jour du document flexibleZone pour retirer les horaireCota correspondant à la date donnée
    const result = await FlexibleZone.updateOne(
      { _id: idFlexibleZone },
      { $pull: { horaire: { date: new Date(date) } } } // Assurez-vous que le format de la date correspond à celui stocké dans la base de données
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({
          message: "FlexibleZone non trouvé ou date non correspondante",
        });
    }

    res
      .status(200)
      .json({
        message: "HoraireCota supprimé avec succès pour la date donnée",
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la suppression des horaireCota",
        error: error.message,
      });
  }
};

exports.checkAndDeleteFlexibleZone = async (req, res) => {
  try {
    // Récupérez tous les flexibleZones avec horaire vide
    const flexibleZonesToDelete = await FlexibleZone.find({ horaire: [] });

    // Supprimez chaque instance de FlexibleZone avec horaire vide
    const deletedFlexibleZones = [];
    for (const flexibleZones of flexibleZonesToDelete) {
      await FlexibleZone.findOneAndDelete({ _id: flexibleZones._id });
      deletedFlexibleZones.push(flexibleZones._id);
    }

    res
      .status(200)
      .json({ message: "Opération réussie", deletedFlexibleZones });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'opération", error: error.message });
  }
};

const mongoose = require("mongoose");
const Stands = require("../models/stands");
const Benevole = require("../models/benevole");
const Festival = require("../models/festival");
const ZoneBenevole = require("../models/zoneBenevole");

exports.createStands = (req, res, next) => {
  const { referents, nom_stand, description, horaireCota, date } = req.body;

  const stands = new Stands({
    referents,
    nom_stand,
    description,
    date,
    horaireCota: horaireCota.map((item) => ({
      heure: item.heure,
      nb_benevole: item.nb_benevole,
      liste_benevole: [], // Initialiser liste_benevole à un tableau vide pour chaque horaire
    })),
  });

  stands
    .save()
    .then(() => {
      res.status(201).json({ message: "Stands créé !" });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.getOneStands = (req, res, next) => {
  Stands.findOne({ _id: req.params.id })
    .populate("referents", "pseudo")
    .populate("horaireCota.liste_benevole", "pseudo")

    .then((stands) => {
      res.status(200).json(stands);
    })
    .catch((error) => {
      res.status(404).json({ error: error });
    });
};

exports.getStandsByReferent = async (req, res) => {
  try {
    const referentId = req.params.id;
    const referent = await Benevole.findById(referentId);

    if (!referent) {
      return res.status(404).json({ message: "Référent non trouvé" });
    }

    const stands = await Stands.find({ referents: referentId })
      .populate("referents", "pseudo")
      .populate("horaireCota.liste_benevole", "pseudo");

    res.status(200).json(stands);
  } catch (error) {
    console.error("Erreur lors de la récupération des stands:", error); // Log de l'erreur pour le débogage
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des stands",
        error: error.message,
      });
  }
};

exports.getStandsByDate = (req, res, next) => {
  Stands.find({ date: req.params.date })
    .populate("referents", "pseudo")
    .populate("horaireCota.liste_benevole", "pseudo")
    .then((stands) => {
      res.status(200).json(stands);
    })
    .catch((error) => {
      res.status(404).json({ error: error });
    });
};

exports.modifyStands = async (req, res) => {
  try {
    const standId = req.params.id;
    const updates = req.body;

    // Mettre à jour le stand avec les données fournies dans req.body
    const updatedStand = await Stands.findByIdAndUpdate(
      standId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedStand) {
      return res.status(404).json({ message: "Stand non trouvé" });
    }

    res.status(200).json({ message: "Stand modifié!", stand: updatedStand });
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la modification du stand",
      error
    );
    res.status(500).json({
      error: "Une erreur s'est produite lors de la modification du stand",
    });
  }
};

exports.deleteStand = async (req, res, next) => {
  try {
    // Récupérez l'ID du stand à supprimer depuis les paramètres de la requête
    const standId = req.params.id;

    // Récupérez le stand à supprimer
    const stand = await Stands.findById(standId);

    if (!stand) {
      return res.status(404).json({ message: "Stand introuvable." });
    }

    // Réinitialisez les bénévoles référents du stand
    const referents = stand.referents;
    for (const referentId of referents) {
      await Benevole.findByIdAndUpdate(referentId, { referent: false });
    }

    // Supprimez le stand lui-même en utilisant findByIdAndDelete
    await Stands.findByIdAndDelete(standId);

    res.status(200).json({ message: "Stand supprimé !" });
  } catch (error) {
    console.error("Erreur lors de la suppression du stand :", error);
    res.status(500).json({
      error: "Une erreur s'est produite lors de la suppression du stand.",
    });
  }
};

exports.getAllStands = (req, res, next) => {
  Stands.find()
    .then((stands) => {
      res.status(200).json(stands);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.addBenevoleToHoraire = async (req, res, next) => {
  const { idHoraire, idBenevole } = req.params;

  try {
    // Trouver l'horaire spécifique pour obtenir l'heure, la date et la capacité
    const standSpecifique = await Stands.findOne({
      "horaireCota._id": idHoraire,
    });

    if (!standSpecifique) {
      return res.status(404).json({ message: "Horaire non trouvé" });
    }

    const horaireSpecifique = standSpecifique.horaireCota.find(
      (h) => h._id.toString() === idHoraire
    );

    if (!horaireSpecifique) {
      return res
        .status(404)
        .json({ message: "Horaire spécifique non trouvé dans le stand" });
    }

    const dateEvenement = standSpecifique.date;
    const heureEvenement = horaireSpecifique.heure;

    // Vérifier si le bénévole est déjà inscrit à un autre stand ou zone pour le même créneau horaire à la même date
    const estDejaInscritDansStand = await Stands.findOne({
      date: dateEvenement,
      horaireCota: {
        $elemMatch: {
          heure: heureEvenement,
          liste_benevole: idBenevole,
        },
      },
    });

    const estDejaInscritDansZone = await ZoneBenevole.findOne({
      horaireCota: {
        $elemMatch: {
          heure: heureEvenement,
          liste_benevole: idBenevole,
        },
      },
    });

    if (estDejaInscritDansStand || estDejaInscritDansZone) {
      return res
        .status(400)
        .json({
          message:
            "Le bénévole est déjà inscrit à un stand ou une zone pour le même créneau horaire à la même date.",
        });
    }

    // Ajouter le bénévole à l'horaire spécifique dans le stand actuel
    horaireSpecifique.liste_benevole.push(idBenevole);
    await standSpecifique.save();

    res
      .status(200)
      .json({
        message: "Bénévole ajouté au stand avec succès",
        stand: standSpecifique,
      });
  } catch (error) {
    console.error("Erreur lors de l'ajout du bénévole au stand", error);
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de l'ajout du bénévole au stand",
      });
  }
};

exports.addFlexibleToStand = async (req, res, next) => {
  const { horaire, standId, idBenevole } = req.params;

  try {
    const stand = await Stands.findById(standId);
    if (!stand) {
      return res.status(404).json({ message: "Stand non trouvé" });
    }

    const horaireSpecifique = stand.horaireCota.find(
      (h) => h.heure === horaire
    );
    if (!horaireSpecifique) {
      return res
        .status(404)
        .json({ message: "Horaire spécifique non trouvé dans le stand" });
    }

    if (
      horaireSpecifique.liste_benevole.length >= horaireSpecifique.nb_benevole
    ) {
      return res
        .status(400)
        .json({ message: "Le créneau horaire est complet." });
    }

    const dateEvenement = stand.date;

    // Vérifier si le bénévole est déjà inscrit à un autre stand ou zone pour le même créneau horaire à la même date
    const autreStand = await Stands.findOne({
      date: dateEvenement,
      horaireCota: {
        $elemMatch: {
          heure: horaire,
          liste_benevole: idBenevole,
        },
      },
    });
    if (autreStand) {
      return res
        .status(400)
        .json({
          message:
            "Le bénévole est déjà inscrit à un autre stand pour le même créneau horaire à la même date.",
        });
    }

    const zoneBenevole = await ZoneBenevole.findOne({
      date: dateEvenement,
      horaireCota: {
        $elemMatch: {
          heure: horaire,
          liste_benevole: idBenevole,
        },
      },
    });
    if (zoneBenevole) {
      return res
        .status(400)
        .json({
          message:
            "Le bénévole est inscrit à une zoneBenevole pour le même créneau horaire à la même date.",
        });
    }

    horaireSpecifique.liste_benevole.push(idBenevole);
    await stand.save();

    res.status(200).json({ message: "Bénévole ajouté avec succès au stand." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.addReferentToStand = (req, res, next) => {
  const { idStand, idBenevole } = req.params;

  // Vérifiez d'abord si le bénévole existe
  Benevole.findById(idBenevole)
    .then((benevole) => {
      if (!benevole) {
        throw new Error("Bénévole non trouvé");
      }
      // Si le bénévole existe, mettez à jour le stand et le bénévole
      return Stands.findOneAndUpdate(
        { _id: idStand },
        { $addToSet: { referents: idBenevole } },
        { new: true, runValidators: true }
      ).then((stand) => {
        if (!stand) {
          throw new Error("Stand non trouvé");
        }
        // Mise à jour du statut de référent du bénévole
        return Benevole.findOneAndUpdate(
          { _id: idBenevole },
          { $set: { referent: true } },
          { new: true, runValidators: true }
        ).then(() => {
          return stand;
        });
      });
    })
    .then((stand) => {
      res.status(200).json({
        message: "Référent ajouté au stand avec succès",
        stand: stand,
      });
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

exports.removeReferentFromStand = async (req, res) => {
  try {
    const { standId, referentId } = req.params;

    // Vérifiez d'abord si le stand existe
    const stand = await Stands.findById(standId);
    if (!stand) {
      return res.status(404).json({ message: "Stand non trouvé" });
    }

    // Vérifiez si le référent existe dans la liste des référents du stand
    const referentIndex = stand.referents.indexOf(referentId);
    if (referentIndex === -1) {
      return res
        .status(404)
        .json({ message: "Référent non trouvé dans le stand" });
    }

    // Supprimez le référent du stand
    stand.referents.splice(referentIndex, 1);

    // Mettez à jour le statut de référent du bénévole à false
    await Benevole.findByIdAndUpdate(referentId, { referent: false });

    // Enregistrez les modifications apportées au stand
    await stand.save();

    res.status(200).json({ message: "Référent supprimé du stand avec succès" });
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la suppression du référent du stand :",
      error
    );
    res.status(500).json({
      error:
        "Une erreur s'est produite lors de la suppression du référent du stand.",
    });
  }
};

exports.getStandBothDate = async (req, res) => {
  try {
    const festival = await Festival.findOne().sort({ date: -1 }); // Récupère les dates du festival

    // Vérifiez si le festival a été trouvé
    if (!festival) {
      throw new Error("Festival non trouvé");
    }

    const stands = await Stands.find();

    const festivalDateDebutStr = festival.date_debut
      .toISOString()
      .split("T")[0];
    const festivalDateFinStr = festival.date_fin.toISOString().split("T")[0];

    const standMap = new Map();

    stands.forEach((stand) => {
      const standDateStr = stand.date.toISOString().split("T")[0];

      if (!standMap.has(stand.nom_stand)) {
        standMap.set(stand.nom_stand, [standDateStr]);
      } else {
        const dates = standMap.get(stand.nom_stand);
        if (!dates.includes(standDateStr)) {
          dates.push(standDateStr);
        }
      }
    });

    const standsAvailableBothDays = Array.from(standMap)
      .filter(
        ([_, dates]) =>
          dates.includes(festivalDateDebutStr) &&
          dates.includes(festivalDateFinStr)
      )
      .map(([nom_stand, _]) => {
        return stands.filter((stand) => stand.nom_stand === nom_stand);
      });

    res.status(200).json(standsAvailableBothDays.flat());
  } catch (error) {
    console.error("Erreur lors de la récupération des stands:", error); // Log de l'erreur pour le débogage
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des stands",
        error: error.message,
      });
  }
};

exports.getStandsByBenevole = async (req, res) => {
  try {
    const benevoleId = req.params.id;
    const benevole = await Benevole.findById(benevoleId);

    if (!benevole) {
      return res.status(404).json({ message: "Bénévole non trouvé" });
    }

    const stands = await Stands.find({
      "horaireCota.liste_benevole": benevoleId,
    });

    res.status(200).json(stands);
  } catch (error) {
    console.error("Erreur lors de la récupération des stands:", error); // Log de l'erreur pour le débogage
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des stands",
        error: error.message,
      });
  }
};

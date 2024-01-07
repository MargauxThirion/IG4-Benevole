const Stands = require("../models/stands");
const Benevole = require("../models/benevole");

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
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la suppression du stand.",
      });
  }
};

exports.getAllStands = (req, res, next) => {
  Stands.find()
    .then((standss) => {
      res.status(200).json(standss);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
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
        return res.status(404).json({ message: "Horaire non trouvé" });
      }
      res
        .status(200)
        .json({ message: "Bénévole ajouté à l'horaire avec succès" });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
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
    res
      .status(500)
      .json({
        error:
          "Une erreur s'est produite lors de la suppression du référent du stand.",
      });
  }
};

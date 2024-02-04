const Festival = require("../models/festival");
const Stand = require("../models/stands");

exports.createFestival = async (req, res, next) => {
  const { nom, lieu, description, date_debut, date_fin } = req.body;

  try {
    // Création du festival
    const festival = new Festival({
      nom,
      lieu,
      description,
      date_debut,
      date_fin,
    });
    await festival.save();

    // Création du premier stand pour la date de début du festival
    const standDebut = new Stand({
      nom_stand: "Animation jeu",
      description: "Animation jeu - Jour 1",
      date: date_debut,
      horaireCota: [],
      referents: [],
    });
    await standDebut.save();

    // Création du second stand pour la date de fin du festival
    const standFin = new Stand({
      nom_stand: "Animation jeu",
      description: "Animation jeu - Jour 2",
      date: date_fin,
      horaireCota: [],
      referents: [],
    });
    await standFin.save();

    res.status(201).json({ message: "Festival et stands associés créés !" });
  } catch (error) {
    console.error(
      "Erreur lors de la création du festival et des stands",
      error
    );
    res.status(400).json({ error });
  }
};

exports.getAllFestival = (req, res, next) => {
  Festival.find()
    .then((festival) => {
      res.status(200).json(festival);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.getOneFestival = (req, res, next) => {
  Festival.findOne({ _id: req.params.id })
    .then((festival) => {
      res.status(200).json(festival);
    })
    .catch((error) => {
      res.status(404).json({ error: error });
    });
};

exports.getLatestFestival = (req, res, next) => {
  // Trouvez le festival avec la date de fin la plus lointaine
  Festival.findOne()
    .sort({ date_fin: -1 })
    .then((latestFestival) => {
      if (latestFestival) {
        res.status(200).json(latestFestival);
      } else {
        res.status(404).json({ message: "Aucun festival trouvé" });
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
      return res.status(404).json({ message: "Festival non trouvé" });
    }

    res
      .status(200)
      .json({ message: "Festival modifié!", festival: updatedFestival });
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la modification du festival",
      error
    );
    res.status(500).json({
      error: "Une erreur s'est produite lors de la modification du festival",
    });
  }
};

exports.deleteFestival = (req, res, next) => {
  Festival.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({ message: "Festival supprimé !" });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

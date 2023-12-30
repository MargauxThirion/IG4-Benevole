const Jeu = require('../models/jeux');
const xlsx = require('xlsx');

exports.importJeuxFromExcel = async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  
    try {
      const workbook = xlsx.readFile(req.file.path);
      const sheetNames = workbook.SheetNames;
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
  
      // Vous pouvez ici supprimer tous les jeux si vous souhaitez réinitialiser la base de données
      // await Jeu.deleteMany({});
  
      const jeuxPromises = sheetData.map(jeu => {
        const newJeu = new Jeu({
            nom_jeu: jeu['Nom du jeu'], // Assurez-vous que le nom de la colonne correspond exactement
            editeur: jeu['Éditeur'],
            niveau: jeu['Type'],
            recu: jeu['Reçu'] === 'oui', // Transformez la valeur en booléen
            lien: jeu['Notice'] // Assurez-vous que le nom de la colonne correspond
        });
        return newJeu.save();

      });
  
      await Promise.all(jeuxPromises);
  
      res.status(201).json({ message: 'Jeux importés avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de l\'importation des jeux', error });
    }
  };

exports.createJeu = (req, res, next) => {
    const jeux = new Jeu({
        nom_jeu: req.body.nom_jeu,
        editeur: req.body.editeur,
        niveau: req.body.niveau,
        recu: req.body.recu,
        lien: req.body.lien,
    });
    jeux.save()
    .then(() => {res.status(201).json({message: 'Jeu créé !'})})
    .catch((error) => {res.status(400).json({error: error})})
};

exports.getOneJeu = (req, res, next) => {
    Jeu.findOne({_id: req.params.id})
    .then((jeux) => {res.status(200).json(jeux)})
    .catch((error) => {res.status(404).json({error: error})})
};

exports.modifyJeu = (req, res, next) => {
    const jeux = new Jeu({
        nom_jeu: req.body.nom_jeu,
        editeur: req.body.editeur,
        niveau: req.body.niveau,
        recu: req.body.recu,
        lien: req.body.lien,
    });
    Jeu.updateOne({_id: req.params.id}, jeu)
    .then(() => {res.status(201).json({message: 'Jeu modifié !'})})
    .catch((error) => {res.status(400).json({error: error})})
};

exports.deleteJeu = (req, res, next) => {
    Jeu.deleteOne({_id: req.params.id})
    .then(() => {res.status(200).json({message: 'Jeu supprimé !'})})
    .catch((error) => {res.status(400).json({error: error})})
};

exports.getAllJeu = (req, res, next) => {
    Jeu.find()
    .then((jeux) => {res.status(200).json(jeux)})
    .catch((error) => {res.status(400).json({error: error})})
};
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
  
      // Supprimez tous les jeux existants
      await Jeu.deleteMany({});

      const uniqueNames = new Set();
      const jeuxPromises = [];
      for (const jeu of sheetData) {
        if (!uniqueNames.has(jeu['Nom du jeu'])) {
          uniqueNames.add(jeu['Nom du jeu']);
          const newJeu = new Jeu({
                nom_jeu: jeu['Nom du jeu'],
                editeur: jeu['Éditeur'],
                type: jeu['Type'],
                ageMin: jeu['âge min'],
                duree: jeu['Durée'],
                theme: jeu['Thèmes'],
                mecanisme: jeu['Mécanismes'],
                tags: jeu['Tags'],
                description: jeu['Description'],
                nbJoueurs: jeu['nb joueurs'],
                recu: jeu['Reçu'] === 'oui', // Transformez la valeur en booléen
                animationRequise: jeu['Animation requise'] === 'oui',
                lien: jeu['Notice'],
                logo: jeu['Logo'],
          });
          jeuxPromises.push(newJeu.save());
        } else {
          // Si le jeu est un doublon, ne faites rien ou loggez-le si nécessaire
          console.log(`Doublon ignoré: ${jeu['Nom du jeu']}`);
        }
      }
      await Promise.all(jeuxPromises);
        res.status(201).json({ message: 'Tout les jeux ont été téléchargés' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de l\'importation des jeux', error });
    }
};

exports.getOneJeu = (req, res, next) => {
    Jeu.findOne({_id: req.params.id})
    .then((jeu) => {res.status(200).json(jeu)})
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

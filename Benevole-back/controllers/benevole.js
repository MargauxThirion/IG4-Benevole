const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Benevole = require('../models/benevole');

exports.modifyBenevole = (req, res, next) => {
    const benevole = new Benevole({
        mail: req.body.mail,
        password: req.body.password,
        pseudo: req.body.pseudo,
        nom: req.body.nom,
        prenom: req.body.prenom,
        admin: req.body.admin,
        referent: req.body.referent,
        association: req.body.association,
        hebergement: req.body.hebergement,
        vegetarien: req.body.vegetarien,
        taille_tshirt: req.body.taille_tshirt,
        adresse: req.body.adresse,
        num_telephone: req.body.num_telephone,
    });
    Benevole.updateOne({_id: req.params.id}, benevole).then(
      () => {
        res.status(201).json({
          message: "Bénévole modifié!"
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };

exports.deleteBenevole = (req, res, next) => {
    Benevole.deleteOne({_id: req.params.id})
    .then(() => {res.status(200).json({message: 'Benevole supprimé !'})})
    .catch((error) => {res.status(400).json({error: error})})
};

exports.getAllBenevole = (req, res, next) => {
    Benevole.find()
    .then((benevoles) => {res.status(200).json(benevoles)})
    .catch((error) => {res.status(400).json({error: error})})
};


exports.getAllBenevoleReferent = (req, res, next) => {
    Benevole.find({referent: true})
    .then((benevoles) => {res.status(200).json(benevoles)})
    .catch((error) => {res.status(400).json({error: error})})
};

// Fonction d'inscription d'un nouvel utilisateur
async function signup(req, res) {
  try {
    const { mail, password, pseudo, nom, prenom, admin, referent, association, hebergement, vegetarien, taille_tshirt, adresse, num_telephone} = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingBenevole = await Benevole.findOne({ pseudo });
    if (existingBenevole) {
      return res.status(409).json({ message: 'Cet utilisateur existe déjà' });
    }

    // Crypter le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur avec la logique conditionnelle pour l'adresse
    let newBenevole;
    if (hebergement === 'proposition') {
      newBenevole = await Benevole.create({ pseudo, password: hashedPassword, mail, nom, prenom, admin, referent, association, hebergement, vegetarien, taille_tshirt, adresse, num_telephone});
    } else {
      newBenevole = await Benevole.create({ pseudo, password: hashedPassword, mail, nom, prenom, admin, referent, association, hebergement, vegetarien, taille_tshirt, num_telephone});
    }

    res.status(201).json({ message: 'Inscription réussie', benevole: newBenevole });
  } catch (error) {
    res.status(500).json({ message: 'Une erreur s\'est produite lors de l\'inscription', error });
  }
}


// Fonction de connexion de l'utilisateur
async function login(req, res) {
  try {
    const { pseudo, password } = req.body;

    // Vérifier si l'utilisateur existe
    const benevole = await Benevole.findOne({ pseudo });
    if (!benevole) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Vérifier si le mot de passe est correct
    const isPasswordValid = await bcrypt.compare(password, benevole.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Générer un token d'authentification
    const token = jwt.sign({ pseudo: benevole.pseudo }, 'secret_key', { expiresIn: '1h' });

    res.json({ message: 'Connexion réussie', token, pseudo: benevole.pseudo });
  } catch (error) {
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la connexion', error });
  }
}

async function getBenevole(req, res) {
  try {
    const decodedPseudo = decodeURIComponent(req.params.pseudo);
    const pseudo = decodedPseudo;

    // Rechercher l'utilisateur dans la base de données
    const benevole = await Benevole.findOne({ pseudo: pseudo });
    if (!benevole) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ benevole });
  } catch (error) {
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des données utilisateur', error });
  }
}

module.exports = { signup, login, getBenevole };
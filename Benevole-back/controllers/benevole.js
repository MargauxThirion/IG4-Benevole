const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Benevole = require("../models/benevole");

async function modifyBenevole(req, res) {
  try {
    const { pseudo } = req.params;
    const benevoleUpdates = req.body;

    // Gérez le champ 'vegetarien'
    if ("vegetarien" in benevoleUpdates) {
      if (typeof benevoleUpdates.vegetarien === "string") {
        benevoleUpdates.vegetarien =
          benevoleUpdates.vegetarien.toLowerCase() === "oui";
      } else if (typeof benevoleUpdates.vegetarien === "boolean") {
        // Ne faites rien ici, car la valeur est déjà un booléen
      }
    }

    // Hacher le nouveau mot de passe si fourni
    if (benevoleUpdates.password && benevoleUpdates.password.trim() !== "") {
      benevoleUpdates.password = await bcrypt.hash(
        benevoleUpdates.password,
        10
      );
    }

    // Utilisez le pseudo pour mettre à jour le bénévole
    const updatedBenevole = await Benevole.findOneAndUpdate(
      { pseudo },
      benevoleUpdates,
      { new: true }
    );

    if (!updatedBenevole) {
      return res.status(404).json({ message: "Bénévole non trouvé" });
    }

    res
      .status(200)
      .json({ message: "Bénévole modifié!", benevole: updatedBenevole });
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la modification du bénévole",
      error
    );
    res.status(500).json({
      error: "Une erreur s'est produite lors de la modification du bénévole",
    });
  }
}

async function deleteBenevole(req, res, next) {
  Benevole.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({ message: "Benevole supprimé !" });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
}

async function getAllBenevole(req, res, next) {
  Benevole.find()
    .then((benevoles) => {
      res.status(200).json(benevoles);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
}

async function getAllBenevoleReferent(req, res) {
  try {
    // Trouver tous les bénévoles qui sont référents
    const referentBenevoles = await Benevole.find({ referent: true });
    res.status(200).json(referentBenevoles);
  } catch (error) {
    res.status(500).json({
      error:
        "Une erreur s'est produite lors de la récupération des bénévoles référents",
    });
  }
}

// Fonction d'inscription d'un nouvel utilisateur
async function signup(req, res) {
  try {
    const {
      mail,
      password,
      pseudo,
      nom,
      prenom,
      admin,
      referent,
      association,
      hebergement,
      vegetarien,
      taille_tshirt,
      adresse,
      num_telephone,
    } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingBenevole = await Benevole.findOne({ pseudo });
    if (existingBenevole) {
      return res.status(409).json({ message: "Cet utilisateur existe déjà" });
    }

    // Crypter le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur avec la logique conditionnelle pour l'adresse
    let newBenevole;
    if (hebergement === "proposition") {
      newBenevole = await Benevole.create({
        pseudo,
        password: hashedPassword,
        mail,
        nom,
        prenom,
        admin,
        referent,
        association,
        hebergement,
        vegetarien,
        taille_tshirt,
        adresse,
        num_telephone,
      });
    } else {
      newBenevole = await Benevole.create({
        pseudo,
        password: hashedPassword,
        mail,
        nom,
        prenom,
        admin,
        referent,
        association,
        hebergement,
        vegetarien,
        taille_tshirt,
        num_telephone,
      });
    }

    res
      .status(201)
      .json({ message: "Inscription réussie", benevole: newBenevole });
  } catch (error) {
    res.status(500).json({
      message: "Une erreur s'est produite lors de l'inscription",
      error,
    });
  }
}

// Fonction de connexion de l'utilisateur
async function login(req, res) {
  try {
    const { pseudo, password } = req.body;

    const benevole = await Benevole.findOne({ pseudo });
    if (!benevole) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const isPasswordValid = await bcrypt.compare(password, benevole.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Générer un token d'authentification
    const token = jwt.sign(
      {
        pseudo: benevole.pseudo,
        admin: benevole.admin,
        referent: benevole.referent,
      },
      "secret_key",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Connexion réussie",
      token,
      pseudo: benevole.pseudo,
      admin: benevole.admin,
      referent: benevole.referent,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la connexion",
      error,
    });
  }
}

async function getBenevole(req, res) {
  try {
    const decodedPseudo = decodeURIComponent(req.params.pseudo);
    const pseudo = decodedPseudo;

    // Rechercher l'utilisateur dans la base de données
    const benevole = await Benevole.findOne({ pseudo: pseudo });
    if (!benevole) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ benevole });
  } catch (error) {
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la récupération des données utilisateur",
      error,
    });
  }
}

async function getBenevoleById(req, res) {
  try {
    const benevoleId = req.params.id; // Récupérer l'ID du bénévole depuis les paramètres de la requête

    // Rechercher le bénévole dans la base de données en utilisant son ID
    const benevole = await Benevole.findById(benevoleId);
    if (!benevole) {
      return res.status(404).json({ message: "Bénévole non trouvé" });
    }

    const pseudo = benevole.pseudo; // Récupérer le pseudo du bénévole

    res.json({ pseudo });
  } catch (error) {
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la récupération du pseudo du bénévole",
      error,
    });
  }
}

async function getNonReferentBenevoles(req, res, next) {
  try {
    const benevoles = await Benevole.find({ referent: false, admin: false });
    res.status(200).json(benevoles);
  } catch (error) {
    res.status(500).json({
      error:
        "Une erreur s'est produite lors de la récupération des bénévoles non référents",
    });
  }
}

async function checkPseudoExists(req, res) {
  try {
    const decodedPseudo = decodeURIComponent(req.params.pseudo);
    const pseudoExists = await Benevole.exists({ pseudo: decodedPseudo });
    res.json({ exists: pseudoExists });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la vérification du pseudo", error });
  }
}

async function promoteToAdmin(req, res, next) {
  Benevole.updateOne({ _id: req.params.id }, { admin: true })
    .then(() => res.status(200).json({ message: "Bénévole promu admin" }))
    .catch((error) => res.status(400).json({ error }));
}

module.exports = {
  signup,
  login,
  getBenevole,
  modifyBenevole,
  getBenevoleById,
  getNonReferentBenevoles,
  getAllBenevole,
  deleteBenevole,
  getAllBenevoleReferent,
  checkPseudoExists,
  promoteToAdmin,
};

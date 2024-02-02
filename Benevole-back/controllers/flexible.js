const Flexible = require('../models/flexible');
const Benevole = require('../models/benevole');
const Stands = require('../models/stands');

exports.createFlexible = (req, res, next) => {
    const { benevole_id, horaire } = req.body;

    // Affichage des horaires pour le débogage
    horaire.forEach(horaireItem => {
        console.log("Date:", horaireItem.date, "Heure:", horaireItem.heure);
        console.log("Liste des stands pour cet horaire:");
        horaireItem.liste_stand.forEach(standId => {
            console.log(standId); // Afficher l'identifiant du stand
        });
    });

    // Rechercher une instance Flexible existante pour ce bénévole
    Flexible.findOneAndUpdate(
        { benevole_id: benevole_id }, // Critères de recherche
        { 
            $set: { 
                horaire: horaire.map(item => ({
                    date: item.date,
                    heure: item.heure,
                    liste_stand: item.liste_stand,
                }))
            } 
        },
        { new: true, upsert: true } // Options : retourner le document modifié et créer s'il n'existe pas
    )
    .then(flexible => {
        if (flexible) {
            res.status(200).json({ message: 'Flexible créé ou mis à jour avec succès !', data: flexible });
        } else {
            res.status(404).json({ message: 'Flexible non trouvé et non créé pour une raison inconnue.' });
        }
    })
    .catch(error => {
        res.status(500).json({ error: error.message });
    });
};


exports.getOneFlexible = (req, res, next) => {
    Flexible.findOne({_id: req.params.id})
    .populate('benevole_id', 'pseudo')
    .populate('horaire.liste_stand', 'id_stand')
    .then((flexible) => {
        res.status(200).json(flexible);
    })
    .catch((error) => {
        res.status(404).json({error: error});
    });
};

exports.getFlexibleByBenevole = (req, res, next) => {
    Flexible.findOne({benevole_id: req.params.id})
    .populate('benevole_id', 'pseudo')
    .populate('horaire.liste_stand', 'nom_stand')
    .then((flexible) => {
        res.status(200).json(flexible);
    })
    .catch((error) => {
        res.status(404).json({error: error});
    });
};

exports.getAllFlexible = (req, res, next) => {
    Flexible.find()
    .populate('benevole_id', 'pseudo')
    .populate('horaire.liste_stand', 'nom_stand')
    .then((flexible) => {res.status(200).json(flexible)})
    .catch((error) => {res.status(400).json({error: error})})
};

exports.removeAllFlexible = (req, res, next) => {
    Flexible.deleteMany()
    .then(() => {res.status(200).json({message: 'Flexible supprimés !'})})
    .catch((error) => {res.status(400).json({error: error})})
};

exports.removeOneFlexibleById = async (req, res) => {
    try {
        // Récupération de l'ID du flexible et de la date depuis les paramètres de la requête
        const { idFlexible, date } = req.params;

        // Mise à jour du document flexible pour retirer les horaireCota correspondant à la date donnée
        const result = await Flexible.updateOne(
            { _id: idFlexible }, 
            { $pull: { horaire: { date: new Date(date) } } } // Assurez-vous que le format de la date correspond à celui stocké dans la base de données
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Flexible non trouvé ou date non correspondante" });
        }

        res.status(200).json({ message: "HoraireCota supprimé avec succès pour la date donnée" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression des horaireCota", error: error.message });
    }
};

exports.checkAndDeleteFlexible = async (req, res) => {
    try {
      // Récupérez tous les flexibles avec horaire vide
      const flexiblesToDelete = await Flexible.find({ horaire: [] });
  
      // Supprimez chaque instance de Flexible avec horaire vide
      const deletedFlexibles = [];
      for (const flexible of flexiblesToDelete) {
        await Flexible.findOneAndDelete({ _id: flexible._id });
        deletedFlexibles.push(flexible._id);
      }
  
      res.status(200).json({ message: 'Opération réussie', deletedFlexibles });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de l\'opération', error: error.message });
    }
  };




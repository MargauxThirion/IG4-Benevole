const Animation = require("../models/animation");

exports.createAnimation = (req, res, next) => {
  const animation = new Animation({
    nb_benevole: req.body.nb_benevole,
    zone: req.body.zone,
    horaire: req.body.horaire,
  });
  animation
    .save()
    .then(() => {
      res.status(201).json({ message: "Animation créée !" });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.getOneAnimation = (req, res, next) => {
  Animation.findOne({ _id: req.params.id })
    .then((animation) => {
      res.status(200).json(animation);
    })
    .catch((error) => {
      res.status(404).json({ error: error });
    });
};

exports.modifyAnimation = (req, res, next) => {
  const animation = new Animation({
    _id: req.params.id,
    nb_benevole: req.body.nb_benevole,
    zone: req.body.zone,
    horaire: req.body.horaire,
  });
  Animation.updateOne({ _id: req.params.id }, animation)
    .then(() => {
      res.status(201).json({ message: "Animation modifiée !" });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.deleteAnimation = (req, res, next) => {
  Animation.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({ message: "Animation supprimée !" });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.getAllAnimation = (req, res, next) => {
  Animation.find()
    .then((animations) => {
      res.status(200).json(animations);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

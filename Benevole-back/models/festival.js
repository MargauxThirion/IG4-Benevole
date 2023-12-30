const mongoose = require('mongoose');

const festivalSchema =  mongoose.Schema({
    nom : { type: String, required: true },
    lieu: { type: String, required: true },
    description: { type: String, required: true },
    date_debut: { type: String, required: true },
    date_fin: { type: String, required: true }
});

module.exports = mongoose.model('Festival', festivalSchema);


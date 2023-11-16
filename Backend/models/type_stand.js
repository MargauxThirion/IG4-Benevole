const mongoose = require('mongoose');

const typeStandSchema = mongoose.Schema({
    nom_stand: { type: String, required: true, unique: true},
    description: { type: String, required: true },
});


module.exports = mongoose.model('TypeStand', typeStandSchema);
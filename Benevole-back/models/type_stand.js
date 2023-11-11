const mongoose = require('mongoose');

const typeStandSchema = mongoose.Schema({
    nom_stand: String,
    description: String,
});


module.exports = mongoose.model('TypeStand', typeStandSchema);
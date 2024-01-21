const mongoose = require('mongoose');
const Benevole = require('./benevole');
const Stands = require('./stands');

const flexibleSchema = mongoose.Schema({
    benevole_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Benevole',
        required: true
    }],
    horaire: [{
        date: {type: Date, required: true},
        heure: {type: String, required: true},
        liste_stand :[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Stands',
            required: true
        }]
        
    }],
    
})

module.exports = mongoose.model('Flexible', flexibleSchema);
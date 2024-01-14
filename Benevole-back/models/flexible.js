const mongoose = require('mongoose');
const Benevole = require('./benevole');
const Stands = require('./stands');

const flexibleSchema = mongoose.Schema({
    benevole_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Benevole',
        required: false
    }],
    horaire: [{
        date : {type: Date, required: true},
        heure: {type: String},
        liste_stand :[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Stands',
            required: false
        }]
        
    }],
    
})

module.exports = mongoose.model('Flexible', flexibleSchema);
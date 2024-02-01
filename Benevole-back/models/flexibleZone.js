const mongoose = require('mongoose');
const Benevole = require('./benevole');
const ZoneBenevole = require('./zoneBenevole');

const flexibleZoneSchema = mongoose.Schema({
    benevole_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Benevole',
        required: true
    }],
    horaire: [{
        date: {type: Date, required: true},
        heure: {type: String, required: true},
        liste_zoneBenevole :[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ZoneBenevole',
            required: true
        }]
        
    }],
    
})

module.exports = mongoose.model('FlexibleZone', flexibleZoneSchema);
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
app.use(cors());

const benevoleRoutes = require('./routes/benevole');
const animationRoutes = require('./routes/animation');
const jeuxRoutes = require('./routes/jeux');
const standsRoutes = require('./routes/stands');
const zoneBenevoleRoutes = require('./routes/zoneBenevole');
const zonePlanRoutes = require('./routes/zonePlan');
const accueilRoutes = require('./routes/accueil');
const festivalRoutes = require('./routes/festival');
const flexibleRoutes = require('./routes/flexible');
const flexibleZoneRoutes = require('./routes/flexibleZone');


app.use(bodyParser.json({ limit: '50mb' }));

mongoose.connect(process.env.DATABASE_URL,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée...'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Accès à l'API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Ajout des headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Envoi de requêtes avec les méthodes mentionnées
    next();
});

app.use('/benevole', benevoleRoutes);
app.use('/animation', animationRoutes);
app.use('/jeux', jeuxRoutes);
app.use('/stands', standsRoutes);
app.use('/zoneBenevole', zoneBenevoleRoutes);
app.use('/zonePlan', zonePlanRoutes);
app.use('/accueil', accueilRoutes);
app.use('/festival', festivalRoutes);
app.use('/flexible', flexibleRoutes);
app.use('/flexibleZone', flexibleZoneRoutes);


module.exports = app;

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const benevoleRoutes = require('./routes/benevole');
const animationRoutes = require('./routes/animation');
const jeuxRoutes = require('./routes/jeux');
const standsRoutes = require('./routes/stands');
const zoneBenevoleRoutes = require('./routes/zoneBenevole');
const accueilRoutes = require('./routes/accueil');
const festivalRoutes = require('./routes/festival');
const flexibleRoutes = require('./routes/flexible');
const flexibleZoneRoutes = require('./routes/flexibleZone');

const corsOptions = {
    origin: '*', // Remplacez '*' par vos domaines spécifiques si besoin
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée...'));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

const corsOptions = {
    origin: 'http://localhost:3000', // Autorise les requêtes depuis localhost:3000
    optionsSuccessStatus: 200, // Répond avec un code 200 pour les requêtes OPTIONS préalables
  };

  app.use(cors(corsOptions));
  
app.use('/benevole', benevoleRoutes);
app.use('/animation', animationRoutes);
app.use('/jeux', jeuxRoutes);
app.use('/stands', standsRoutes);
app.use('/zoneBenevole', zoneBenevoleRoutes);
app.use('/accueil', accueilRoutes);
app.use('/festival', festivalRoutes);
app.use('/flexible', flexibleRoutes);
app.use('/flexibleZone', flexibleZoneRoutes);


module.exports = app;

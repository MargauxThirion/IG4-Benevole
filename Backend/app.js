require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const benevoleRoutes = require('./routes/benevole');
const animationRoutes = require('./routes/animation');
const typeStandRoutes = require('./routes/type_stand');
const jeuxRoutes = require('./routes/jeux');
const standsRoutes = require('./routes/stands');
const zoneRoutes = require('./routes/zone');
const accueilRoutes = require('./routes/accueil');

const app = express();

mongoose.connect(process.env.DATABASE_URL,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée...'));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json()); 

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Accès à l'API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Ajout des headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Envoi de requêtes avec les méthodes mentionnées
    next();
});

app.use('/benevole', benevoleRoutes);
app.use('/animation', animationRoutes);
app.use('/type_stand', typeStandRoutes);
app.use('/jeux', jeuxRoutes);
app.use('/stands', standsRoutes);
app.use('/zone', zoneRoutes);
app.use('/accueil', accueilRoutes);

module.exports = app;
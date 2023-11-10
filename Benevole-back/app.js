// user : auriane - mdp cluster : btstjd7
require('dotenv').config();
const cors = require('cors');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwtMiddleware = require('./middleware/auth');

const tipsRoutes = require('./routes/tips');
const eventRoutes = require('./routes/event');
const userRoutes = require('./routes/user');
const defiRoutes = require('./routes/defi');
const partRoutes = require('./routes/participe');

mongoose.connect(process.env.DATABASE_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json()); 

// header permettant d'accéder à l'API depuis n'importe où
// ajoute les headers mentionnés aux requêtes envoyées vers l'API
// envoie requête avec les méthodes GET, POST ...
//sert à éviter les erreurs de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/event', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/defi', defiRoutes);
app.use('/api/tips', tipsRoutes);
app.use('/api/participe', partRoutes);

module.exports = app;
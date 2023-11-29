const jwt = require('jsonwebtoken');

// Middleware pour vérifier l'authenticité du token
function authMiddleware(req, res, next) {
  // Récupérer le token d'authentification depuis le header
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Aucun token d\'authentification fourni' });
  }

  // Vérifier le token
  console.log(token);
  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token d\'authentification invalide' });
    }

    // Vérifier si l'e-mail est présent dans le token décodé
    if (!decoded.pseudo) {
      return res.status(401).json({ message: 'Token d\'authentification invalide - email manquant' });
    }

    // Ajouter l'e-mail de l'utilisateur décodé à l'objet de requête
    req.benevolePseudo = decoded.pseudo;
    console.log(decoded);

    // Passer au middleware suivant
    next();
  });
}

module.exports = authMiddleware;
const express = require("express");
const cors = require("cors");
const mysql = require('mysql2')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());



const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'senbanks'
})

// Endpoint pour afficher tous les comptes
app.get('/comptes', (req, res) => {
    db.query('SELECT * FROM comptes', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        res.json(results)
    })
})

// Endpoint pour la connexion (POST)
app.post("/connexion", (req, res) => {
  const { numeroCompte, motDePasse } = req.body;

  if (!numeroCompte || !motDePasse) {
    return res.status(400).json({ error: "numeroCompte et motDePasse requis" });
  }

  db.query(
    "SELECT * FROM comptes WHERE numeroCompte = ?",
    [numeroCompte],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length === 0) {
        return res.status(401).json({ message: "Numéro de compte n'existe pas" });
      }

      const compte = results[0];

      // Vérifie si le compte est archivé ou bloqué
      if (compte.archive === 1) {
        return res.status(403).json({ message: "Votre compte est supprimé" });
      }
      if (compte.bloquer === 1) {
        return res.status(403).json({ message: "Votre compte est bloqué" });
      }

        const isValidPassword = (motDePasse === compte.motDePasse)
        if (!isValidPassword) {
          return res.status(401).json({ message: "Mot de passe invalide" });
        }

      // Génération du token JWT
      const token = jwt.sign(
        { id: compte.id, numeroCompte: compte.numeroCompte },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Retirer le mot de passe de l'objet compte avant de renvoyer
      delete compte.motDePasse;

      return res.json({
        message: "Connexion réussie",
        token,
        compte,
      });
    }
  );
});

// recuperer profil
app.post('/profil', (req, res) => {
  const { idUsers } = req.body;
  
  db.query(
    'SELECT * FROM users WHERE idUser = ?',
    [idUsers],
    async (err, results) => {
      if (err)
        return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(401).json({ message: "Utilisateur non trouvé" });
      
      const user = results[0];
      return res.status(200).json(user);
    }
  );
});

// recuperer solde (pour en temps reel cote client)
app.post('/solde', (req, res) => {
  const { idUser } = req.body;

  // Validation de l'entrée
  if (!idUser || isNaN(idUser)) {
    return res.status(400).json({ error: 'L\'idUser est requis et doit être un nombre valide.' });
  }

  db.query(
    'SELECT solde FROM comptes WHERE idusers = ?',
    [idUser],
    (err, results) => {
      if (err) {
        console.error('Erreur lors de la requête SQL:', err);
        return res.status(500).json({ error: 'Erreur interne du serveur.' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Aucun compte trouvé pour cet utilisateur.' });
      }
      solde = results[0].solde
      return res.status(200).json({ solde });
    }
  );
});
// modification de mot de passe
app.post('/editpassword',(req,res)=>{
  const { iduser , encienmdp , noueaumdp} = req.body
  db.query(
    'SELECT motDePasse FROM comptes WHERE idusers = ?',
    [iduser],
    (err,results) => {
      if(err)
        return res.status(500).json({error: err.message})
      if(results.length === 0)

        return res.status(401).json({message : "compte user introuvable"})
      mdp = results[0].motDePasse

      if(mdp != encienmdp)
        return res.status(200).json({message: "mot de passe incorrcte"})

      db.query(
        'UPDATE comptes SET motDePasse = ? WHERE idusers = ?',
        [noueaumdp,iduser],
        (err1,resultats1)=>{
          if(err1)
            return res.status(500).json({error: err1.message})
          return res.status(200).json({message: resultats1.message})
        }
      )
    }
  )
})
// tranfert effectuer par un client
app.post('transfert',(req,res) => {
  const {iduser,idDestinataire,montant} = req.body
  
})
const PORT = 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));

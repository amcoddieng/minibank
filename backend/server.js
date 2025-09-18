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
app.post('/profil',(req,res)=>{
  {}
})



const PORT = 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));

// const express = require("express");
// const cors = require("cors");
// const mysql = require("mysql2");

// const app = express();
// app.use(cors());
// app.use(express.json());

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "senbank",
// });

// // Endpoint pour afficher tous les comptes
// app.get("/comptes", (req, res) => {
//   db.query("SELECT * FROM compte", (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.json(results);
//   });
// });

// // Endpoint pour la connexion (POST)
// app.post("/connexion", (req, res) => {
//   const { numeroCompte, motDePasse } = req.body;

//   if (!numeroCompte || !motDePasse) {
//     return res.status(400).json({ error: "numeroCompte et motDePasse requis" });
//   }

//   db.query(
//     "SELECT * FROM compte WHERE numeroCompte = ? AND motDePasse = ?",
//     [numeroCompte, motDePasse],
//     (err, results) => {
//       if (err) return res.status(500).json({ error: err.message });
//       if (!Array.isArray(results) || results.length === 0)
//         return res
//           .status(401)
//           .json({ message: "Numéro de compte ou mot de passe incorrect" });

//       res.json({ message: "Connexion réussie", compte: results[0] });
//     }
//   );
// });

// // Démarrage du serveur
// app.listen(4000, () => {
//   console.log("Serveur backend démarré sur http://localhost:4000");
// });

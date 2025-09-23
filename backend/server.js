const express = require("express");
const cors = require("cors");
const mysql = require('mysql2')
const bcrypt = require("bcrypt");
const crypto = require("crypto");
require("dotenv").config();
const jwt = require('jsonwebtoken');
const { sourceMapsEnabled } = require("process");

const app = express();
app.use(cors());
app.use(express.json());

// Middleware d'authentification
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Token requis." });

  const token = authHeader.split(" ")[1]; // récupère le token après 'Bearer'
  if (!token) return res.status(401).json({ error: "Token manquant." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalide." });
  }
};


// generer numero compte

function generateId() {
  return crypto.randomBytes(6) // 6 bytes ~ 12 caractères hex
    .toString("base64")        // encodage base64
    .replace(/[^A-Z0-9]/gi, "") // garder que lettres/chiffres
    .slice(0, 8)                // max 8 caractères
    .toUpperCase();             // majuscules
}
                            
// connexion a la base de donnee
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'senbanks'
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
        return res.status(400).json({ message: "Numéro de compte n'existe pas" });
      }

      const compte = results[0];

      // Vérifie si le compte est archivé ou bloqué
      if (compte.archive === 1) {
        return res.status(403).json({ message: "Votre compte est supprimé" });
      }
      if (compte.bloquer === 1) {
        return res.status(403).json({ message: "Votre compte est bloqué" });
      }

      // *** Vérification en clair (tel que demandé) ***
      const isValidPassword = motDePasse === compte.motDePasse;
      if (!isValidPassword) {
        return res.status(401).json({ message: "Mot de passe invalide" });
      }

      // Génération du token JWT (assure-toi d'avoir process.env.JWT_SECRET défini)
      const token = jwt.sign(
        { idCompte: compte.idCompte, numeroCompte: compte.numeroCompte },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Retirer le mot de passe avant d'envoyer la réponse
      delete compte.motDePasse;

      // Chercher l'utilisateur lié
      db.query(
        "SELECT * FROM users WHERE idUser = ?",
        [compte.idusers],
        (err, userResults) => {
          if (err) return res.status(500).json({ message: err.message });

          if (!userResults || userResults.length === 0) {
            // Option : tu peux renvoyer quand même token+compte si l'utilisateur lié n'existe pas
            // Ici je renvoie 404 pour être explicite
            return res.status(404).json({ message: "Utilisateur introuvable" });
          }

          const user = userResults[0];

          return res.json({
            message: "Connexion réussie",
            token,
            compte,
            user,
          });
        }
      );
    }
  );
});
// connexion pour agent
app.post('/connexionAgent',(req,res)=>{
  const {email,mdp} = req.body
  db.query(
    'select * from agents where email = ? and mdp = ?',
    [email,mdp],
    (err,result)=>{
      if(err) return res.status(500).json({error: err.message})
      if(result.length === 0) return res.status(400).json({message: "email ou mot de passe invalide"})
        agent = result[0]
      
      return res.status(500).json({agent,status : 200})
    }
  )
}
)
// recuperer profil
app.post('/profil',authMiddleware, (req, res) => {
  const { idUsers } = req.body;

  // Validation de l'entrée
  if (!idUsers || isNaN(idUsers)) {
    return res.status(400).json({ error: 'L\'idUsers est requis et doit être un nombre valide.' });
  }

  db.query(
    'SELECT * FROM users WHERE idUser = ?',
    [idUsers],
    (err, results) => {
      if (err) {
        console.error('Erreur lors de la requête SQL:', err);
        return res.status(500).json({ error: 'Erreur interne du serveur.' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.'});
      }

      const user = results[0];
      return res.status(200).json({ user });
    }
  );
});
// verification user
app.post('/userExiste',authMiddleware,(req,res)=>{
  const {iduser} = req.body
  db.query(
    'select * from users where idUser = ?',
    [iduser],
    (err,results)=>{
      if(err)
        return res.status(500).json({message: "huhuh"})
      if(results.length === 0)
        return res.status(401).json({user: false})
      return res.status(200).json({user: true})
    }
  )
}
)
/// Récupérer solde du compte connecté
app.get('/solde', authMiddleware, (req, res) => {
  const { idCompte } = req.user; // récupéré du token (connexion)

  if (!idCompte) {
    return res.status(400).json({ error: "idCompte manquant dans le token." });
  }

  db.query(
    "SELECT solde FROM comptes WHERE idCompte = ?",
    [idCompte],
    (err, results) => {
      if (err) {
        console.error("Erreur SQL:", err);
        return res.status(500).json({ error: "Erreur interne du serveur." });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Compte introuvable." });
      }

      const solde = results[0].solde;
      return res.status(200).json({ solde });
    }
  );
});

// modification de mot de passe
app.post('/editpassword',authMiddleware,(req,res)=>{
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
// depot  chez le distributeur
// app.post('/depot', (req, res) => {
//   const { idCompte, compteDestinataire, montant } = req.body;
//   const commission = montant * 0.01;
//   const montantDebiter = montant - commission;

//   db.beginTransaction(err => {
//     if (err) return res.status(500).json({ error: err.message });

//     // Vérifier solde du compte source
//     db.query('SELECT solde FROM comptes WHERE idCompte = ?', [idCompte], (err, results) => {
//       if (err) return db.rollback(() => res.status(500).json({ error: err.message }));
//       if (results.length === 0) return db.rollback(() => res.status(404).json({ error: 'Compte source introuvable' }));
//       if (results[0].solde < montantDebiter) return db.rollback(() => res.status(400).json({ error: 'Solde insuffisant' }));

//       // Débit du compte source
//       db.query('UPDATE comptes SET solde = solde - ? WHERE idCompte = ?', [montantDebiter, idCompte], (err) => {
//         if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

//         // Crédit du compte destinataire
//         db.query('UPDATE comptes SET solde = solde + ? WHERE numeroCompte = ?', [montant, compteDestinataire], (err) => {
//           if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

//           // Récupérer idCompte destinataire
//           db.query('SELECT idCompte FROM comptes WHERE numeroCompte = ?', [compteDestinataire], (err, results) => {
//             if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

//             const idCompteDestinataire = results[0].idCompte;

//             // Enregistrer la transaction
//             db.query(
//               'INSERT INTO transactions (type, montant, frais, idCompteSource, idCompteDestinataire, etat, dateTransaction) VALUES (?, ?, ?, ?, ?, ?, NOW())',
//               ['depot', montant, commission, idCompte, idCompteDestinataire, 'reussi'],
//               (err) => {
//                 if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

//                 // Valider la transaction
//                 db.commit(err => {
//                   if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

//                   res.status(200).json({
//                     message: 'depot effectué avec succès',
//                     montantTransfere: montant,
//                     frais: commission,
//                     montantDebite: montantDebiter
//                   });
//                 });
//               }
//             );
//           });
//         });
//       });
//     });
//   });
// });
app.post('/depot', authMiddleware, (req, res) => {
  const { compteDestinataire, montant } = req.body;
  const idCompte = req.user.idCompte; // récupéré du token
  const commission = montant * 0.01;
  const montantDebiter = montant - commission;

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: err.message });

    // Vérifier solde du compte source
    db.query('SELECT solde FROM comptes WHERE idCompte = ?', [idCompte], (err, results) => {
      if (err) return db.rollback(() => res.status(500).json({ error: err.message }));
      if (results.length === 0) return db.rollback(() => res.status(404).json({ error: 'Compte source introuvable' }));
      if (results[0].solde < montantDebiter) return db.rollback(() => res.status(400).json({ error: 'Solde insuffisant' }));

      // Débit du compte source
      db.query('UPDATE comptes SET solde = solde - ? WHERE idCompte = ?', [montantDebiter, idCompte], (err) => {
        if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

        // Crédit du compte destinataire
        db.query('UPDATE comptes SET solde = solde + ? WHERE numeroCompte = ?', [montant, compteDestinataire], (err) => {
          if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

          // Récupérer idCompte destinataire
          db.query('SELECT idCompte FROM comptes WHERE numeroCompte = ?', [compteDestinataire], (err, results) => {
            if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

            if (results.length === 0) {
              return db.rollback(() => res.status(404).json({ error: 'Compte destinataire introuvable' }));
            }

            const idCompteDestinataire = results[0].idCompte;

            // Enregistrer la transaction
            db.query(
              'INSERT INTO transactions (type, montant, frais, idCompteSource, idCompteDestinataire, etat, dateTransaction) VALUES (?, ?, ?, ?, ?, ?, NOW())',
              ['depot', montant, commission, idCompte, idCompteDestinataire, 'reussi'],
              (err) => {
                if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

                // Valider la transaction
                db.commit(err => {
                  if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

                  res.status(200).json({
                    message: 'Depot effectué avec succès',
                    montantTransfere: montant,
                    frais: commission,
                    montantDebite: montantDebiter
                  });
                });
              }
            );
          });
        });
      });
    });
  });
});

// retrait chez le distributeur
app.post('/retrait',authMiddleware, (req, res) => {
  const { numeroCompteClient, idCompteDistributeur, montant } = req.body;
  const commission = montant * 0.01; // frais éventuels pour le distributeur
  const montantTotal = montant + commission; // montant total à transférer du client au distributeur

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: err.message });

    // Récupérer le compte client
    db.query('SELECT idCompte, solde FROM comptes WHERE numeroCompte = ?', [numeroCompteClient], (err, results) => {
      if (err) return db.rollback(() => res.status(500).json({ error: err.message }));
      if (results.length === 0) return db.rollback(() => res.status(404).json({ error: 'Compte client introuvable' }));

      const idCompteClient = results[0].idCompte;
      const soldeClient = results[0].solde;

      if (soldeClient < montant) return db.rollback(() => res.status(400).json({ error: 'Solde client insuffisant' }));

      // Débiter le compte client
      db.query('UPDATE comptes SET solde = solde - ? WHERE idCompte = ?', [montant, idCompteClient], (err) => {
        if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

        // Créditer le compte distributeur
        db.query('UPDATE comptes SET solde = solde + ? WHERE idCompte = ?', [montantTotal, idCompteDistributeur], (err) => {
          if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

          // Enregistrer la transaction
          db.query(
            'INSERT INTO transactions (type, montant, frais, idCompteSource, idCompteDestinataire, etat, dateTransaction) VALUES (?, ?, ?, ?, ?, ?, NOW())',
            ['retrait', montant, commission, idCompteClient, idCompteDistributeur, 'reussi'],
            (err) => {
              if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

              // Valider la transaction
              db.commit(err => {
                if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

                res.status(200).json({
                  message: 'Retrait effectué avec succès',
                  montantRetire: montant,
                  frais: commission,
                  montantCrediteDistributeur: montantTotal
                });
              });
            }
          );
        });
      });
    });
  });
});
// lister tout les transactions
app.get('/alltransaction',authMiddleware,(req,res)=>{
  db.query(
    'select * from transactions',
    (err,results)=>{
      if(err)
        return res.status(500).json({error: err.message})
      return res.status(200).json({results})
    }
  )
})
// liste de transaction d'un user
app.post('/alltransactByidCompte',authMiddleware,(req,res)=>{
  const {idCompte} = req.body
  db.query(
    'select * from transactions where idCompteSource = ? OR idCompteDestinataire = ?',
    [idCompte,idCompte],
    (err,results)=>{
      if(err)
        return res.status(500).json({error: err.message})
      return res.status(200).json({results})
    }
  )
})
// recherche transaction par idtransaction
app.get('/Searchtransaction',authMiddleware,(req,res)=>{
  const {idtransaction} = req.body
  db.query(
    'select * from transactions where id = ?',
    [idtransaction],
    (err,resultats)=>{
      if(err)
        return res.status(500).json({error: err.message})
      return res.status(200).json({resultats})
    }
  )
})
// afficher tous les comptes
app.get('/comptes',authMiddleware, (req, res) => {
    db.query('SELECT * FROM comptes', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        res.json(results)
    })
})
// lister tout les comptes : trier par role
app.get('/comptesByrole/:role',authMiddleware,(req, res) => {
  const { role } = req.params;

  // Validation du rôle
  if (!role || typeof role !== 'string' || role.trim() === '') {
    return res.status(400).json({ error: 'Le rôle est requis et doit être une chaîne valide.' });
  }

  db.query(
    'SELECT c.*, u.nom, u.role FROM comptes c JOIN users u ON c.idusers = u.idUser WHERE u.role = ? ORDER BY u.role',
    [role],
    (err, results) => {
      if (err) {
        console.error('Erreur lors de la requête SQL:', err);
        return res.status(500).json({ error: 'Erreur interne du serveur.' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Aucun compte trouvé pour ce rôle.' });
      }

      return res.status(200).json({ comptes: results });
    }
  );
});
// masque solde
app.post('/masksolde',authMiddleware, (req, res) => {
  const { idCompte, ismask } = req.body;
  
  db.query(
    'UPDATE comptes SET masksolde = ? WHERE idCompte = ?',
    [ismask, idCompte],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(200).json({ message: "réussi" });
    }
  );
});
// creer un compte
app.post('/usersT', (req, res) => {
  const {
    nom,
    prenom,
    dateNaissance,
    lieuNaissance,
    photo,
    telephone,
    adresse,
    nin,
    role
  } = req.body;

  if (!nom || !prenom || !dateNaissance || !lieuNaissance || !telephone || !adresse || !nin || !role) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  db.beginTransaction(err => {
    if (err) {
      console.error('Erreur lors du démarrage de la transaction:', err);
      return res.status(500).json({ error: 'Erreur interne du serveur1.' });
    }

    // Créer l'utilisateur
    db.query(
      `INSERT INTO users (nom, prenom, dateNaissance, lieuNaissance, photo, telephone, adresse, nin, role) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nom, prenom, dateNaissance, lieuNaissance, photo, telephone, adresse, nin, role],
      (err, result) => {
        if (err) {
          return db.rollback(() => {
            console.error('Erreur lors de la création de l\'utilisateur:', err);
            res.status(500).json({ error: 'Erreur interne du serveur2.' });
          });
        }

        const userId = result.insertId;

        // Créer la table associée selon le rôle
        let sqlRole;
        if (role === 'client') sqlRole = `INSERT INTO clients (iduser) VALUES (?)`;
        else if (role === 'distributeur') sqlRole = `INSERT INTO distributeurs (iduser) VALUES (?)`;

        const insertRole = () => {
          if (!sqlRole) return commitUser(); // Si rôle 'agent' ou autre, on passe

          db.query(sqlRole, [userId], (err, resultRole) => {
            if (err) {
              return db.rollback(() => {
                console.error('Erreur lors de la création du rôle:', err);
                res.status(500).json({ error: 'Erreur interne du serveur3.' });
              });
            }
            commitUser();
          });
        };

        // Créer le compte bancaire par défaut
        const commitUser = () => {
          const numeroCompte = generateId();
          const sqlCompte = `INSERT INTO comptes (idusers, numeroCompte, solde, motDePasse) VALUES (?, ?, ?, ?)`;
          db.query(sqlCompte, [userId, numeroCompte, 0, 'motdepasse123'], (err, resultCompte) => {
            if (err) {
              return db.rollback(() => {
                console.error('Erreur lors de la création du compte:', err);
                res.status(500).json({ error: 'Erreur interne du serveur4.' });
              });
            }

            // Commit de la transaction
            db.commit(err => {
              if (err) {
                return db.rollback(() => {
                  console.error('Erreur lors du commit:', err);
                  res.status(500).json({ error: 'Erreur interne du serveur5.' });
                });
              }

              res.status(201).json({
                message: 'Utilisateur et compte créés avec succès.',
                idUser: userId,
                numeroCompte: numeroCompte
              });
            });
          });
        };

        insertRole();
      }
    );
  });
});


// tranfert faite par le client
app.post('/transfert', authMiddleware,(req, res) => {
  const { idCompte, compteDestinataire, montant } = req.body;

  
  if (!idCompte || !compteDestinataire || !montant || isNaN(montant) || montant <= 0) {
    return res.status(400).json({ error: 'idCompte, compteDestinataire et montant (positif) sont requis.' });
  }

  const frais = montant * 0.02;
  const montantTotal = montant + frais;

  db.beginTransaction(err => {
    if (err) {
      console.error('Erreur lors du démarrage de la transaction:', err);
      return res.status(500).json({ error: 'Erreur interne du serveur1.' });
    }

    // Vérifier l'existence du compte source et le solde
    db.query('SELECT solde, idusers FROM comptes WHERE idCompte = ?', [idCompte], (err, results) => {
      if (err) {
        return db.rollback(() => {
          console.error('Erreur lors de la vérification du compte source:', err);
          res.status(500).json({ error: 'Erreur interne du serveur2.' });
        });
      }

      if (results.length === 0) {
        return db.rollback(() => {
          res.status(404).json({ error: 'Compte source non trouvé.' });
        });
      }

      const compteSource = results[0];
      if (compteSource.solde < montantTotal) {
        return db.rollback(() => {
          res.status(400).json({ error: 'Solde insuffisant pour couvrir le montant et les frais.' });
        });
      }

      db.query('SELECT idCompte FROM comptes WHERE numeroCompte = ?', [compteDestinataire], (err, results) => {
        if (err) {
          return db.rollback(() => {
            console.error('Erreur lors de la vérification du compte destinataire:', err);
            res.status(500).json({ error: 'Erreur interne du serveur3.' });
          });
        }

        if (results.length === 0) {
          return db.rollback(() => {
            res.status(404).json({ error: 'Compte destinataire non trouvé.' });
          });
        }

        const idCompteDestinataire = results[0].idCompte;

        // Débit du compte source (montant + frais)
        db.query(
          'UPDATE comptes SET solde = solde - ? WHERE idCompte = ?',
          [montantTotal, idCompte],
          (err, result) => {
            if (err) {
              return db.rollback(() => {
                console.error('Erreur lors du débit:', err);
                res.status(500).json({ error: 'Erreur interne du serveur4.' });
              });
            }

            // Crédit du compte destinataire (montant uniquement)
            db.query(
              'UPDATE comptes SET solde = solde + ? WHERE idCompte = ?',
              [montant, idCompteDestinataire],
              (err, result) => {
                if (err) {
                  return db.rollback(() => {
                    console.error('Erreur lors du crédit:', err);
                    res.status(500).json({ error: 'Erreur interne du serveur5.' });
                  });
                }

                // Enregistrer la transaction
                db.query(
                  'INSERT INTO transactions (type, montant, frais, idCompteSource, idCompteDestinataire, etat, dateTransaction) VALUES (?, ?, ?, ?, ?, ?, NOW())',
                  ['transfert', montant, frais, idCompte, idCompteDestinataire, 'reussi'],
                  (err, result) => {
                    if (err) {
                      return db.rollback(() => {
                        console.error('Erreur lors de l\'enregistrement de la transaction:', err);
                        res.status(500).json({ error: 'Erreur interne du serveur6.' });
                      });
                    }

                    // Valider la transaction
                    db.commit(err => {
                      if (err) {
                        return db.rollback(() => {
                          console.error('Erreur lors de la validation:', err);
                          res.status(500).json({ error: 'Erreur interne du serveur7.' });
                        });
                      }

                      res.status(200).json({
                        message: 'Transfert effectué avec succès.',
                        nouveauSoldeSource: compteSource.solde - montantTotal,
                        montantTransfere: montant,
                        frais: frais
                      });
                    });
                  }
                );
              }
            );
          }
        );
      });
    });
  });
});
// le nombre de client
app.get('/nbrClient',authMiddleware,(req,res)=>{
  db.query(
    'select count(id) as nbrClient from clients',
    (err,result)=>{
      if(err) return res.status(500).json({error: err.message})
      nbrClient = result[0].nbrClient
      return res.status(200).json({nbrClient})
    }
  )
})
// le nombre de distributeur
app.get('/nbrDistributeur',authMiddleware,(req,res)=>{
  db.query(
    'select count(id) as nbrDistributeur from distributeurs',
    (err,result)=>{
      if(err) return res.status(500).json({error: err.message})
      nbrDistributeur = result[0].nbrDistributeur
      return res.status(200).json({nbrDistributeur})
    }
  )
})
// crediter un compte distributeur
app.post('/crediterCompte',authMiddleware, (req, res) => {
  const { idCompte, montant } = req.body;
  db.beginTransaction(err => {
  if (err) return res.status(500).json({ error: err.message });

  db.query(
    'UPDATE comptes SET solde = solde + ? WHERE idCompte = ?', 
    [montant, idCompte], 
    (err, result) => {
    if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

    db.query(
      'INSERT INTO creditation (idCompte, montant) VALUES (?, ?)', 
      [idCompte, montant], 
      (err, result) => {
      if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

      db.commit(err => {
        if (err) return db.rollback(() => res.status(500).json({ error: err.message }));
        res.status(200).json({ message: 'Compte crediter avec succès' });
      });
    });
  });
});

});
// debiter un compte distributeur
app.post('/debiterCompte',authMiddleware,(req, res) => {
  const { idCompte, montant } = req.body;
  db.beginTransaction(err => {
  if (err) return res.status(500).json({ error: err.message });

  db.query(
    'UPDATE comptes SET solde = solde - ? WHERE idCompte = ?', 
    [montant, idCompte], 
    (err, result) => {
    if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

    db.query(
      'INSERT INTO creditation (idCompte, montant) VALUES (?, ?)', 
      [idCompte, -montant], 
      (err, result) => {
      if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

      db.commit(err => {
        if (err) return db.rollback(() => res.status(500).json({ error: err.message }));
        res.status(200).json({ message: 'Compte débité avec succès' });
      });
    });
  });
});

});
// annuler transaction
app.post('/annulerTransaction',authMiddleware, (req, res) => {
  const { idtransaction } = req.body;

  // Démarrer la transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur de début de transaction', details: err.message });
    }

    // 1. Vérifier la transaction
    db.query(
      'SELECT * FROM transactions WHERE id = ? FOR UPDATE',
      [idtransaction],
      (err, result) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }
        
        if (result.length === 0) {
          return db.rollback(() => {
            res.status(404).json({ message: "Transaction introuvable" ,status:404});
          });
        }
        
        if (result[0].etat === "annule") {
          return db.rollback(() => {
            res.status(400).json({ message: "Transaction déjà annulée" });
          });
        }

        const { type, montant, frais, idCompteSource: source, idCompteDestinataire: dest } = result[0];

        // 2. Exécuter les opérations selon le type
        if (type === "transfert") {
          // Premier UPDATE: retirer du destinataire
          db.query(
            'UPDATE comptes SET solde = solde - ? WHERE idCompte = ?',
            [montant, dest],
            (err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ error: err.message });
                });
              }
              
              // Deuxième UPDATE: remettre à la source avec frais
              db.query(
                'UPDATE comptes SET solde = solde + ? WHERE idCompte = ?',
                [montant + frais, source],
                (err) => {
                  if (err) {
                    return db.rollback(() => {
                      res.status(500).json({ error: err.message });
                    });
                  }
                  
                  // Marquer comme annulé
                  updateTransactionState();
                }
              );
            }
          );
        } else if (type === "depot") {
          // Premier UPDATE: retirer du destinataire
          db.query(
            'UPDATE comptes SET solde = solde - ? WHERE idCompte = ?',
            [montant, dest],
            (err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ error: err.message });
                });
              }
              
              // Deuxième UPDATE: remettre à la source
              db.query(
                'UPDATE comptes SET solde = solde + ? WHERE idCompte = ?',
                [montant, source],
                (err) => {
                  if (err) {
                    return db.rollback(() => {
                      res.status(500).json({ error: err.message });
                    });
                  }
                  
                  // Marquer comme annulé
                  updateTransactionState();
                }
              );
            }
          );
        } else if (type === "retrait") {
          // Premier UPDATE: retirer du destinataire
          db.query(
            'UPDATE comptes SET solde = solde - ? WHERE idCompte = ?',
            [montant, dest],
            (err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ error: err.message });
                });
              }
              
              // Deuxième UPDATE: remettre à la source
              db.query(
                'UPDATE comptes SET solde = solde + ? WHERE idCompte = ?',
                [montant, source],
                (err) => {
                  if (err) {
                    return db.rollback(() => {
                      res.status(500).json({ error: err.message });
                    });
                  }
                  
                  // Marquer comme annulé
                  updateTransactionState();
                }
              );
            }
          );
        } else {
          return db.rollback(() => {
            res.status(400).json({ message: "Type de transaction non supporté" });
          });
        }

        // Fonction pour mettre à jour l'état de la transaction
        function updateTransactionState() {
          db.query(
            "UPDATE transactions SET etat = 'annule' WHERE id = ?",
            [idtransaction],
            (err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ error: err.message });
                });
              }
              
              // Commit final
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    res.status(500).json({ error: err.message });
                  });
                }
                
                res.status(200).json({ 
                  message: "Annulation réussie", 
                  type,
                  transactionId: idtransaction
                });
              });
            }
          );
        }
      }
    );
  });
});
// transfert effectuer par distributeur
app.post('/transfertDist',authMiddleware, (req, res) => {
  const { idCompte, compteDestinataire, montant } = req.body;
  
  if (!idCompte || !compteDestinataire || !montant || isNaN(montant) || montant <= 0) {
    return res.status(400).json({ error: 'idCompte, compteDestinataire et montant (positif) sont requis.' });
  }

  const frais = montant * 0.02;
  const montantTotal = montant - frais;

  db.beginTransaction(err => {
    if (err) {
      console.error('Erreur lors du démarrage de la transaction:', err);
      return res.status(500).json({ error: 'Erreur interne du serveur1.' });
    }

    // Vérifier l'existence du compte source et le solde
    db.query('SELECT solde, idusers FROM comptes WHERE idCompte = ?', [idCompte], (err, results) => {
      if (err) {
        return db.rollback(() => {
          console.error('Erreur lors de la vérification du compte source:', err);
          res.status(500).json({ error: 'Erreur interne du serveur2.' });
        });
      }

      if (results.length === 0) {
        return db.rollback(() => {
          res.status(404).json({ error: 'Compte source non trouvé.' });
        });
      }

      const compteSource = results[0];
      if (compteSource.solde < montantTotal) {
        return db.rollback(() => {
          res.status(400).json({ error: 'Solde insuffisant pour couvrir le montant.' });
        });
      }

      db.query('SELECT idCompte FROM comptes WHERE numeroCompte = ?', [compteDestinataire], (err, results) => {
        if (err) {
          return db.rollback(() => {
            console.error('Erreur lors de la vérification du compte destinataire:', err);
            res.status(500).json({ error: 'Erreur interne du serveur3.' });
          });
        }

        if (results.length === 0) {
          return db.rollback(() => {
            res.status(404).json({ error: 'Compte destinataire non trouvé.' });
          });
        }

        const idCompteDestinataire = results[0].idCompte;

        // Débit du compte source (montant + frais)
        db.query(
          'UPDATE comptes SET solde = solde - ? WHERE idCompte = ?',
          [montantTotal, idCompte],
          (err, result) => {
            if (err) {
              return db.rollback(() => {
                console.error('Erreur lors du débit:', err);
                res.status(500).json({ error: 'Erreur interne du serveur4.' });
              });
            }

            // Crédit du compte destinataire (montant uniquement)
            db.query(
              'UPDATE comptes SET solde = solde + ? WHERE idCompte = ?',
              [montantTotal, idCompteDestinataire],
              (err, result) => {
                if (err) {
                  return db.rollback(() => {
                    console.error('Erreur lors du crédit:', err);
                    res.status(500).json({ error: 'Erreur interne du serveur5.' });
                  });
                }

                // Enregistrer la transaction
                db.query(
                  'INSERT INTO transactions (type, montant, frais, idCompteSource, idCompteDestinataire, etat, dateTransaction) VALUES (?, ?, ?, ?, ?, ?, NOW())',
                  ['transfert', montantTotal, frais, idCompte, idCompteDestinataire, 'reussi'],
                  (err, result) => {
                    if (err) {
                      return db.rollback(() => {
                        console.error('Erreur lors de l\'enregistrement de la transaction:', err);
                        res.status(500).json({ error: 'Erreur interne du serveur6.' });
                      });
                    }

                    // Valider la transaction
                    db.commit(err => {
                      if (err) {
                        return db.rollback(() => {
                          console.error('Erreur lors de la validation:', err);
                          res.status(500).json({ error: 'Erreur interne du serveur7.' });
                        });
                      }

                      res.status(200).json({
                        message: 'Transfert effectué avec succès.',
                        nouveauSoldeSource: compteSource.solde - montantTotal,
                        montantTransfere: montant,
                        frais: frais
                      });
                    });
                  }
                );
              }
            );
          }
        );
      });
    });
  });
});
const PORT = 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));


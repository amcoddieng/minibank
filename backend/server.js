const express = require("express");
const cors = require("cors");
const mysql = require('mysql2')
const bcrypt = require("bcrypt");
const crypto = require("crypto");
require("dotenv").config();
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Middleware d'authentification (exemple avec JWT)
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Token requis.' });
  try {
    const decoded = jwt.verify(token, 'votre_clé_secrète');
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide.' });
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

console.log(generateId()); // ex: "A7K9ZQ3B"

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
app.post('/userExiste',(req,res)=>{
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


// tranfert faite par le client
// app.post('/transfert', (req, res) => {
//   const { idCompte, compteDestinataire, montant } = req.body;
//   frais = (montant*0.02)
//   montant_plus_frais = montant + frais
//   db.beginTransaction(err => {
//     if (err) return res.status(500).json({ error: err.message });

//     // Débit du compte source
//     db.query(
//       'UPDATE comptes SET solde = solde - ? WHERE idCompte = ?',
//       [montant_plus_frais, idCompte],
//       (err, result) => {
//         if (err) {
//           return db.rollback(() => {
//             res.status(500).json({ error: err.message });
//           });
//         }

//         // Crédit du compte destinataire
//         db.query(
//           'UPDATE comptes SET solde = solde + ? WHERE numeroCompte = ?',
//           [montant, compteDestinataire],
//           (err1, result1) => {
//             if (err1) {
//               return db.rollback(() => {
//                 res.status(500).json({ error: err1.message });
//               });
//             }

//             // Validation de la transaction
//             db.commit(err2 => {
//               if (err2) {
//                 return db.rollback(() => {
//                   res.status(500).json({ error: err2.message });
//                 });
//               }
//                 db.query(
//                   "SELECT idCompte FROM comptes WHERE numeroCompte = ?",
//                   [compteDestinataire],
//                   async (err1, results1) => {
//                     if (err1) return res.status(500).json({ error: err1.message });
//                       db.query(
//                           'insert into transations (type,montant,frais,idCompteSource,idCompteDestinataire,etat) values ("transfert",?,?,?,?,"reussi") ',
//                           [montant,frais,idCompte,results1],
//                           (err2,result2)=>{

//                           }
//                         )
//                   }
//                 )
//               res.json({ message: 'Transfert effectué avec succès' });
//             });
//           }
//         );
//       }
//     );
//   });
// });
//depot
app.post('/transaction', (req, res) => {
  const { idCompte, compteDestinataire, montant } = req.body;

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: err.message });

    // Débit du compte source
    db.query(
      'UPDATE comptes SET solde = solde - ? WHERE idCompte = ?',
      [montant, idCompte],
      (err, result) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }

        // Crédit du compte destinataire
        db.query(
          'UPDATE comptes SET solde = solde + ? WHERE numeroCompte = ?',
          [montant, compteDestinataire],
          (err1, result1) => {
            if (err1) {
              return db.rollback(() => {
                res.status(500).json({ error: err1.message });
              });
            }

            // Validation de la transaction
            db.commit(err2 => {
              if (err2) {
                return db.rollback(() => {
                  res.status(500).json({ error: err2.message });
                });
              }

              res.json({ message: 'Transfert effectué avec succès' });
            });
          }
        );
      }
    );
  });
});
// retrait
app.post('/retrait', (req, res) => {
  const { idCompte, compteDestinataire, montant } = req.body;
  
  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: err.message });

    // Crédit du compte source
    db.query(
      'UPDATE comptes SET solde = solde + ? WHERE idCompte = ?',
      [montant, idCompte],
      (err, result) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }

        // Débit du compte destinataire
        db.query(
          'UPDATE comptes SET solde = solde - ? WHERE numeroCompte = ?',
          [montant, compteDestinataire],
          (err1, result1) => {
            if (err1) {
              return db.rollback(() => {
                res.status(500).json({ error: err1.message });
              });
            }

            // Validation de la transaction
            db.commit(err2 => {
              if (err2) {
                return db.rollback(() => {
                  res.status(500).json({ error: err2.message });
                });
              }

              res.json({ message: 'Transfert effectué avec succès' });
            });
          }
        );
      }
    );
  });
});
// lister tout les transactions
app.get('/alltransaction',(req,res)=>{
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
app.post('/alltransactByidCompte',(req,res)=>{
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
app.get('/Searchtransaction',(req,res)=>{
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
// Endpoint pour afficher tous les comptes
app.get('/comptes', (req, res) => {
    db.query('SELECT * FROM comptes', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        res.json(results)
    })
})
// lister tout les comptes : trier par role
app.get('/comptesByrole/:role', (req, res) => {
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
app.post('/masksolde', (req,res) => {
  const {idCompte} = req.body
  db.query(
    'update compte set masksolde = ? where idCompte = ?'
  )
})
// creer un compte
// app.post('creerCompte',(req,res)=>{
//   const {nom,prenom,datenais,lieunais,photo,telephone,adresse,nin,role} = req.body
  
//   db.query(
//     'insert into users (nom,prenom,dateNaisance,lieuNaissance,photo,telephone,adresse,nin,role) VALUES (?,?,?,?,?,?,?,?,?)',
//     [nom,prenom,datenais,lieunais,photo,telephone,adresse,nin,role],
//     (req,res)=>{
//       if(err)
//         return res.status(500).json({error: err.message})
//       db.query(
//         'insert into comptes ()'
//       )
//     }
//   )
// })


app.post('/transfert', (req, res) => {
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


const PORT = 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));


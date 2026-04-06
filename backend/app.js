const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Ajoutez cette ligne
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Configuration CORS
app.use(cors({
 origin: ['http://localhost:3001','http://localhost:3000', 'http://127.0.0.1:8080', 'http://localhost:8080', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Ou plus simplement pour autoriser toutes les origines (en développement) :
// app.use(cors());

// Connexion MySQL 
const db = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'mot_de_passe',
  database: process.env.DB_NAME || 'mafami',
});

// Test connexion
db.connect(err => {
  if (err) {
    console.error('Erreur de connexion MySQL:', err);
    throw err;
  }
  console.log(' MySQL connecté');
});

// === ROUTES MEMBRES
// POST nouveau membre (unique ou multiple)
app.post('/api/membres', (req, res) => {
  const membres = Array.isArray(req.body) ? req.body : [req.body];
  
  if (membres.length === 0) {
    return res.status(400).json({ error: 'Aucune donnée reçue' });
  }

  let successCount = 0;
  let errorCount = 0;
  const errors = [];
  const insertedIds = [];

  const processInsertions = (index) => {
    if (index >= membres.length) {
      return res.json({
        message: `${successCount} membre(s) créé(s) avec succès`,
        total: membres.length,
        success: successCount,
        errors: errorCount,
        insertedIds: insertedIds,
        errorDetails: errors
      });
    }

    const membre = membres[index];
    
    if (!membre.nom && !membre.prenom) {
      errors.push({ 
        index: index, 
        data: membre, 
        error: 'Le nom et le prénom sont requis' 
      });
      errorCount++;
      return processInsertions(index + 1);
    }

    const query = `
      INSERT INTO membre 
      (nom, prenom, sexe, date_naiss, lieu_naiss, cin, date_cin, 
       lieu_cin, telephone, adress, filiere, niveau_etude, 
       region_origine, annee_adh,droit_adhesion_2026) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      membre.nom || null,
      membre.prenom || null,
      membre.sexe || null,
      membre.date_naiss || null,
      membre.lieu_naiss || null,
      membre.cin || null,
      membre.date_cin || null,
      membre.lieu_cin || null,
      membre.telephone || null,
      membre.adress || null,
      membre.filiere || null,
      membre.niveau_etude || null,
      membre.region_origine || null,
      membre.annee_adh || null,
      membre.droit_adhesion_2026 ||  'Incomplet'
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error(`❌ Erreur pour ${membre.nom} ${membre.prenom}:`, err.message);
        errors.push({ 
          index: index, 
          data: membre, 
          error: err.message 
        });
        errorCount++;
      } else {
        console.log(`✅ Insertion réussie: ${membre.nom} ${membre.prenom} (ID: ${result.insertId})`);
        successCount++;
        insertedIds.push(result.insertId);
      }
      processInsertions(index + 1);
    });
  };

  processInsertions(0);
});

// GET tous les membres
app.get('/api/membres', (req, res) => {
  db.query('SELECT * FROM membre', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET membre par ID
app.get('/api/membres/:id', (req, res) => {
  db.query('SELECT * FROM membre WHERE id_membre = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Membre non trouvé' });
    res.json(results[0]);
  });
});

// PUT modifier membre
app.put('/api/membres/:id', (req, res) => {
  const { 
    nom, prenom, sexe, date_naiss, lieu_naiss, cin, date_cin, 
    lieu_cin, telephone, adress, filiere, niveau_etude, 
    region_origine, annee_adh ,droit_adhesion_2026
  } = req.body;
  
  db.query(
    `UPDATE membre SET 
    nom=?, prenom=?, sexe=?, date_naiss=?, lieu_naiss=?, cin=?, 
    date_cin=?, lieu_cin=?, telephone=?, adress=?, filiere=?, 
    niveau_etude=?, region_origine=?, annee_adh=? ,droit_adhesion_2026=?
    WHERE id_membre=?`,
    [nom || null, prenom || null, sexe || null, date_naiss || null, 
     lieu_naiss || null, cin || null, date_cin || null, lieu_cin || null, 
     telephone || null, adress || null, filiere || null, niveau_etude || null, 
     region_origine || null, annee_adh || null, droit_adhesion_2026 || null, req.params.id], 
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Membre non trouvé' });
      }
      res.json({ message: 'Membre mis à jour avec succès' });
    }
  );
});

// DELETE membre
app.delete('/api/membres/:id', (req, res) => {
  db.query('DELETE FROM membre WHERE id_membre=?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Membre non trouvé' });
    }
    res.json({ message: 'Membre supprimé avec succès' });
  });
});

// GET membres par filière
app.get('/api/membres/filiere/:filiere', (req, res) => {
  db.query('SELECT * FROM membre WHERE filiere = ?', [req.params.filiere], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET membres par niveau d'étude
app.get('/api/membres/niveau/:niveau', (req, res) => {
  db.query('SELECT * FROM membre WHERE niveau_etude = ?', [req.params.niveau], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Supprimer tous les membres
app.delete('/api/membres', (req, res) => {
  db.query('DELETE FROM membre', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ 
      message: 'Tous les membres ont été supprimés',
      deletedCount: result.affectedRows 
    });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend sur http://localhost:${PORT}`);
});

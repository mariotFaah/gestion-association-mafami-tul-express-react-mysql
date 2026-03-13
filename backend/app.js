const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Connexion MySQL Laragon
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'boutique'
});

// Test connexion
db.connect(err => {
  if (err) throw err;
  console.log('✅ MySQL connecté');
});

// === ROUTES PRODUITS ===
// GET tous les produits
app.get('/api/produits', (req, res) => {
  db.query('SELECT * FROM produits', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET produit par ID
app.get('/api/produits/:id', (req, res) => {
  db.query('SELECT * FROM produits WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Produit non trouvé' });
    res.json(results[0]);
  });
});

// POST nouveau produit
app.post('/api/produits', (req, res) => {
  const { designation, prix, qte_stock } = req.body;
  db.query('INSERT INTO produits (designation, prix, qte_stock) VALUES (?, ?, ?)', 
    [designation, prix, qte_stock], 
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, message: 'Produit créé' });
    }
  );
});

// PUT modifier produit
app.put('/api/produits/:id', (req, res) => {
  const { designation, prix, qte_stock } = req.body;
  db.query('UPDATE produits SET designation=?, prix=?, qte_stock=? WHERE id=?', 
    [designation, prix, qte_stock, req.params.id], 
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Produit mis à jour' });
    }
  );
});

// DELETE produit
app.delete('/api/produits/:id', (req, res) => {
  db.query('DELETE FROM produits WHERE id=?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Produit supprimé' });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend sur http://localhost:${PORT}`);
});

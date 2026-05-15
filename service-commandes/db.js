const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'commandes.json');

function load() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ commandes: [], nextId: 1 }));
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function save(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function getAll() {
  return load().commandes;
}

function getById(id) {
  return load().commandes.find(c => c.id === id) || null;
}

function create(utilisateur_id, produit_id, quantite) {
  const data = load();
  const commande = {
    id: data.nextId++,
    utilisateur_id,
    produit_id,
    quantite,
    statut: 'en_attente'
  };
  data.commandes.push(commande);
  save(data);
  return commande;
}

module.exports = { getAll, getById, create };

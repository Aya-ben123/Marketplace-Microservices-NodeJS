const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_FILE = path.join(__dirname, 'produits.json');

function load() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function save(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function getAll() {
  return load();
}

function getById(id) {
  return load().find(p => p.id === id) || null;
}

function create(nom, prix, stock) {
  const produits = load();
  const nouveau = { id: uuidv4(), nom, prix, stock };
  produits.push(nouveau);
  save(produits);
  return nouveau;
}

function updateStock(id, quantite) {
  const produits = load();
  const idx = produits.findIndex(p => p.id === id);
  if (idx === -1) return null;
  produits[idx].stock = Math.max(0, produits[idx].stock - quantite);
  save(produits);
  return produits[idx];
}

module.exports = { getAll, getById, create, updateStock };

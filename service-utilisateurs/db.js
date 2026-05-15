const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'utilisateurs.json');

function load() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ utilisateurs: [], nextId: 1 }));
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function save(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function getAll() {
  return load().utilisateurs;
}

function getById(id) {
  return load().utilisateurs.find(u => u.id === id) || null;
}

function create(nom, email) {
  const data = load();
  const existe = data.utilisateurs.find(u => u.email === email);
  if (existe) throw new Error('Email déjà utilisé');
  const utilisateur = { id: data.nextId++, nom, email };
  data.utilisateurs.push(utilisateur);
  save(data);
  return utilisateur;
}

module.exports = { getAll, getById, create };

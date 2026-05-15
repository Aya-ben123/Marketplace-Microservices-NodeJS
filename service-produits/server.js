const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const db = require('./db');

const PROTO_PATH = path.join(__dirname, '../protos/produits.proto');

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const proto = grpc.loadPackageDefinition(packageDef).produits;

function GetProduit(call, callback) {
  const produit = db.getById(call.request.id);
  if (!produit) {
    return callback({ code: grpc.status.NOT_FOUND, message: 'Produit non trouvé' });
  }
  callback(null, produit);
}

function ListProduits(call, callback) {
  const produits = db.getAll();
  callback(null, { produits });
}

function CreateProduit(call, callback) {
  const { nom, prix, stock } = call.request;
  const produit = db.create(nom, prix, stock);
  callback(null, produit);
}

function UpdateStock(call, callback) {
  const { id, quantite } = call.request;
  const produit = db.updateStock(id, quantite);
  if (!produit) {
    return callback({ code: grpc.status.NOT_FOUND, message: 'Produit non trouvé' });
  }
  callback(null, produit);
}

const server = new grpc.Server();
server.addService(proto.ProduitsService.service, {
  GetProduit,
  ListProduits,
  CreateProduit,
  UpdateStock
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('Service Produits démarré sur le port 50051');
});

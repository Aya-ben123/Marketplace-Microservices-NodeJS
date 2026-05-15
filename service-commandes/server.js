const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const db = require('./db');
const kafkaProducer = require('./kafka-producer');

const PROTO_PATH = path.join(__dirname, '../protos/commandes.proto');

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const proto = grpc.loadPackageDefinition(packageDef).commandes;

function GetCommande(call, callback) {
  const commande = db.getById(call.request.id);
  if (!commande) {
    return callback({ code: grpc.status.NOT_FOUND, message: 'Commande non trouvée' });
  }
  callback(null, commande);
}

function ListCommandes(call, callback) {
  const commandes = db.getAll();
  callback(null, { commandes });
}

async function CreateCommande(call, callback) {
  const { utilisateur_id, produit_id, quantite } = call.request;
  const commande = db.create(utilisateur_id, produit_id, quantite);
  await kafkaProducer.publierCommande({
    commande_id: commande.id,
    produit_id: commande.produit_id,
    quantite: commande.quantite
  });
  callback(null, commande);
}

async function main() {
  await kafkaProducer.connect();

  const server = new grpc.Server();
  server.addService(proto.CommandesService.service, {
    GetCommande,
    ListCommandes,
    CreateCommande
  });

  server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Service Commandes démarré sur le port 50052');
  });
}

main().catch(console.error);

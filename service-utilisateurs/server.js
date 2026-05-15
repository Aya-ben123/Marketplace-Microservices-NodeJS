const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const db = require('./db');

const PROTO_PATH = path.join(__dirname, '../protos/utilisateurs.proto');

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const proto = grpc.loadPackageDefinition(packageDef).utilisateurs;

function GetUtilisateur(call, callback) {
  const utilisateur = db.getById(call.request.id);
  if (!utilisateur) {
    return callback({ code: grpc.status.NOT_FOUND, message: 'Utilisateur non trouvé' });
  }
  callback(null, utilisateur);
}

function ListUtilisateurs(call, callback) {
  const utilisateurs = db.getAll();
  callback(null, { utilisateurs });
}

function CreateUtilisateur(call, callback) {
  const { nom, email } = call.request;
  try {
    const utilisateur = db.create(nom, email);
    callback(null, utilisateur);
  } catch (e) {
    callback({ code: grpc.status.ALREADY_EXISTS, message: 'Email déjà utilisé' });
  }
}

const server = new grpc.Server();
server.addService(proto.UtilisateursService.service, {
  GetUtilisateur,
  ListUtilisateurs,
  CreateUtilisateur
});

server.bindAsync('0.0.0.0:50053', grpc.ServerCredentials.createInsecure(), () => {
  console.log('Service Utilisateurs démarré sur le port 50053');
});

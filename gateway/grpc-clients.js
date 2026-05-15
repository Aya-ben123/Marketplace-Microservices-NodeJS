const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

function loadClient(protoFile, packageName, serviceName, address) {
  const def = protoLoader.loadSync(path.join(__dirname, '../protos', protoFile), {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
  const proto = grpc.loadPackageDefinition(def)[packageName];
  return new proto[serviceName](address, grpc.credentials.createInsecure());
}

const produitsClient = loadClient('produits.proto', 'produits', 'ProduitsService', 'localhost:50051');
const commandesClient = loadClient('commandes.proto', 'commandes', 'CommandesService', 'localhost:50052');
const utilisateursClient = loadClient('utilisateurs.proto', 'utilisateurs', 'UtilisateursService', 'localhost:50053');

function callGrpc(client, method, request) {
  return new Promise((resolve, reject) => {
    client[method](request, (err, response) => {
      if (err) reject(err);
      else resolve(response);
    });
  });
}

module.exports = { produitsClient, commandesClient, utilisateursClient, callGrpc };

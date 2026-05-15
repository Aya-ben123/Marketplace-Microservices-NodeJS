const { produitsClient, commandesClient, utilisateursClient, callGrpc } = require('./grpc-clients');

const resolvers = {
  Query: {
    produits: () => callGrpc(produitsClient, 'ListProduits', {}).then(r => r.produits),
    produit: (_, { id }) => callGrpc(produitsClient, 'GetProduit', { id }),
    commandes: () => callGrpc(commandesClient, 'ListCommandes', {}).then(r => r.commandes),
    commande: (_, { id }) => callGrpc(commandesClient, 'GetCommande', { id }),
    utilisateurs: () => callGrpc(utilisateursClient, 'ListUtilisateurs', {}).then(r => r.utilisateurs),
    utilisateur: (_, { id }) => callGrpc(utilisateursClient, 'GetUtilisateur', { id })
  },
  Mutation: {
    creerProduit: (_, args) => callGrpc(produitsClient, 'CreateProduit', args),
    creerCommande: (_, args) => callGrpc(commandesClient, 'CreateCommande', args),
    creerUtilisateur: (_, args) => callGrpc(utilisateursClient, 'CreateUtilisateur', args)
  }
};

module.exports = { resolvers };

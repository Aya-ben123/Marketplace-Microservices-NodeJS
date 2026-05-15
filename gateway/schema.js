const { gql } = require('graphql-tag');

const typeDefs = gql`
  type Produit {
    id: String
    nom: String
    prix: Float
    stock: Int
  }

  type Commande {
    id: Int
    utilisateur_id: Int
    produit_id: String
    quantite: Int
    statut: String
  }

  type Utilisateur {
    id: Int
    nom: String
    email: String
  }

  type Query {
    produits: [Produit]
    produit(id: String!): Produit
    commandes: [Commande]
    commande(id: Int!): Commande
    utilisateurs: [Utilisateur]
    utilisateur(id: Int!): Utilisateur
  }

  type Mutation {
    creerProduit(nom: String!, prix: Float!, stock: Int!): Produit
    creerCommande(utilisateur_id: Int!, produit_id: String!, quantite: Int!): Commande
    creerUtilisateur(nom: String!, email: String!): Utilisateur
  }
`;

module.exports = { typeDefs };

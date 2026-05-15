# Marketplace Microservices

## Structure

```
marketplace/
├── protos/                  # Fichiers .proto partagés
├── service-produits/        # gRPC :50051 | DB: JSON (RxDB-like) | Kafka Consumer
├── service-commandes/       # gRPC :50052 | DB: SQLite3 | Kafka Producer
├── service-utilisateurs/    # gRPC :50053 | DB: SQLite3
└── gateway/                 # REST sur :3000 | GraphQL sur :4000
```

## Installation

```bash
cd service-produits && npm install
cd ../service-commandes && npm install
cd ../service-utilisateurs && npm install
cd ../gateway && npm install
```

## Démarrage (4 terminaux séparés)

```bash
# Terminal 1
cd service-utilisateurs && node server.js

# Terminal 2
cd service-produits && node server.js

# Terminal 3
cd service-commandes && node server.js

# Terminal 4
cd gateway && node index.js
```

## Kafka Consumer (terminal 5, optionnel)

```bash
cd service-produits && node kafka-consumer.js
```

> Kafka doit tourner sur localhost:9092

## Ports

| Service       | Port  |
|---------------|-------|
| Produits      | 50051 |
| Commandes     | 50052 |
| Utilisateurs  | 50053 |
| Gateway REST  | 3000  |
| GraphQL       | 3000/graphql |

## Exemples REST (Postman)

**Créer un produit**
```
POST http://localhost:3000/produits
{ "nom": "Laptop", "prix": 999.99, "stock": 10 }
```

**Créer une commande** (déclenche Kafka → réduit le stock)
```
POST http://localhost:3000/commandes
{ "utilisateur_id": 1, "produit_id": "<uuid>", "quantite": 2 }
```

## Exemple GraphQL

```graphql
query {
  produits {
    id
    nom
    prix
    stock
  }
}

mutation {
  creerUtilisateur(nom: "Alice", email: "alice@mail.com") {
    id
    nom
  }
}
```

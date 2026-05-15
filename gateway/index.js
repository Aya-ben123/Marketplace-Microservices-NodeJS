const express = require('express');
const bodyParser = require('body-parser');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');
const { produitsClient, commandesClient, utilisateursClient, callGrpc } = require('./grpc-clients');

const app = express();
app.use(bodyParser.json());

app.get('/produits', async (req, res) => {
  try {
    const result = await callGrpc(produitsClient, 'ListProduits', {});
    res.json(result.produits);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/produits/:id', async (req, res) => {
  try {
    const result = await callGrpc(produitsClient, 'GetProduit', { id: req.params.id });
    res.json(result);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

app.post('/produits', async (req, res) => {
  try {
    const result = await callGrpc(produitsClient, 'CreateProduit', req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/commandes', async (req, res) => {
  try {
    const result = await callGrpc(commandesClient, 'ListCommandes', {});
    res.json(result.commandes);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/commandes/:id', async (req, res) => {
  try {
    const result = await callGrpc(commandesClient, 'GetCommande', { id: parseInt(req.params.id) });
    res.json(result);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

app.post('/commandes', async (req, res) => {
  try {
    const result = await callGrpc(commandesClient, 'CreateCommande', req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/utilisateurs', async (req, res) => {
  try {
    const result = await callGrpc(utilisateursClient, 'ListUtilisateurs', {});
    res.json(result.utilisateurs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/utilisateurs/:id', async (req, res) => {
  try {
    const result = await callGrpc(utilisateursClient, 'GetUtilisateur', { id: parseInt(req.params.id) });
    res.json(result);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

app.post('/utilisateurs', async (req, res) => {
  try {
    const result = await callGrpc(utilisateursClient, 'CreateUtilisateur', req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

async function start() {
  const apollo = new ApolloServer({ typeDefs, resolvers });
  await apollo.start();

  app.use('/graphql', expressMiddleware(apollo));

  app.listen(3000, () => {
    console.log('API Gateway démarrée sur http://localhost:3000');
    console.log('GraphQL disponible sur http://localhost:3000/graphql');
  });
}

start().catch(console.error);

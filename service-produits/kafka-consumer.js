const { Kafka } = require('kafkajs');
const db = require('./db');

const kafka = new Kafka({
  clientId: 'service-produits',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'produits-group' });

async function run() {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'commande-creee', fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const data = JSON.parse(message.value.toString());
          console.log('Commande reçue, réduction du stock:', data);
          const produit = db.updateStock(data.produit_id, data.quantite);
          if (produit) {
            console.log(`Stock mis à jour pour ${produit.nom}: ${produit.stock} restants`);
          } else {
            console.log('Produit introuvable:', data.produit_id);
          }
        } catch (e) {
          console.warn('Erreur traitement message Kafka:', e.message);
        }
      }
    });
  } catch (e) {
    console.warn('Kafka non disponible, consumer non démarré:', e.message);
  }
}

run();

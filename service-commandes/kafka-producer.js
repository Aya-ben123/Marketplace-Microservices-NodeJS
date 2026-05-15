const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'service-commandes',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();
let connecte = false;

async function connect() {
  try {
    await producer.connect();
    connecte = true;
    console.log('Kafka producer connecté');
  } catch (e) {
    console.warn('Kafka non disponible, les événements ne seront pas publiés:', e.message);
  }
}

async function publierCommande(commande) {
  if (!connecte) {
    console.warn('Kafka non connecté, événement ignoré:', commande);
    return;
  }
  try {
    await producer.send({
      topic: 'commande-creee',
      messages: [{ value: JSON.stringify(commande) }]
    });
    console.log('Événement publié sur Kafka:', commande);
  } catch (e) {
    console.warn('Erreur publication Kafka:', e.message);
  }
}

module.exports = { connect, publierCommande };

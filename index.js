const WebSocket = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const { connection } = require('./database/connect');

const app = express();
const routesMessages = require('./route/messages');
const routesDiscussion = require('./route/discussion');
const port = 5000;

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

connection('mongodb://127.0.0.1:27017/', (erreur) => {
  if (erreur) {
    console.error(erreur);
    console.log('Erreur lors de la connexion à la base de données');
    process.exit(-1);
  } else {
    console.log('Connexion à la base de données réussie');
    const server = app.listen(port, () => {
      console.log('Le serveur est en cours d\'exécution sur le port:', port);
    });

    const wss = new WebSocket.Server({ server });

    // Créez un tableau pour stocker les connexions clients WebSocket
    const clients = [];

    wss.on('connection', (ws) => {
      // Ajoutez le client à la liste des connexions
      clients.push(ws);
      
      ws.on('message', (message) => {
        // Gérez les messages reçus du client WebSocket
        console.log('Message reçu:', message);
        // Ajoutez votre logique de traitement des messages ici
      
        // Diffusez le message à tous les clients connectés, sauf à l'émetteur d'origine
        clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message);
          } else if (client === ws) {
            // Envoyez le message uniquement à l'émetteur d'origine
            client.send("Message envoyé avec succès !");
          }
        });
      });
      
      

      ws.on('close', () => {
        // Supprimez le client de la liste des connexions lors de la fermeture
        const index = clients.indexOf(ws);
        if (index !== -1) {
          clients.splice(index, 1);
        }
      });
    });
  }
});

app.get('/', (req, res) => {
  res.send('<h3>Server connected !</h3>');
});

app.use("/app", routesMessages);
app.use("/app", routesDiscussion);

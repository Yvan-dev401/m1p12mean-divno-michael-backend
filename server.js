const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const { PORT, MONGO_URI } = require('./config');

const app = express();

app.use(
  cors({
    origin: "https://m1p12mean-divmic.vercel.app",
    credentials: true,
  })
);
  
app.use(express.json());

let db;

// MongoClient.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
MongoClient.connect(MONGO_URI)
  .then((client) => {
    db = client.db();
    console.log("MongoDB connecté");
  })
  .catch((err) => console.log(err));

// Middleware pour injecter la base de données dans les requêtes
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Routes
app.get('/test', (req, res) => {
  res.json("mety amzay");
});
app.use('/probleme', require('./routes/problemeRoute'));
app.use('/devis', require('./routes/devisRoute'));
app.use('/user', require('./routes/utilisateurRoute'));
app.use('/vehicule', require('./routes/vehiculeRoute'));
app.use('/reparation', require('./routes/reparationRoute'));
app.use('/stock', require('./routes/stockRoute'));
app.use('/sortie', require('./routes/sortieRoute'));
app.use('/entree', require('./routes/entreeRoute'));
app.use('/commande', require('./routes/commande'));
app.use('/paiement', require('./routes/paiement'));
app.use('/statistique', require('./routes/statistique'));


app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));

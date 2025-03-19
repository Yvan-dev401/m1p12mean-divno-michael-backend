const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {PORT, MONGO_URI} = require('./config')

const app = express();

app.use(cors({
    origin: 'http://localhost:4200', 
    credentials: true 
  }));
  
app.use(express.json());

// Connexion à MongoDB 
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connecté"))
    .catch(err => console.log(err));
    
// Routes 
app.use('/probleme', require('./routes/problemeRoute'))
app.use('/user', require('./routes/utilisateurRoute'));
app.use('/vehicule', require('./routes/vehiculeRoute'));
app.use('/reparation', require('./routes/reparationRoute'));
app.use('/stock', require('./routes/stockRoute'))
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`)); 
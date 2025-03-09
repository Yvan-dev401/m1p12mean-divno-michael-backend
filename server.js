const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {PORT, MONGO_URI} = require('./config')

console.log("test",PORT)

const app = express();



// Middleware 
app.use(cors());
app.use(express.json());

// Connexion à MongoDB 
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connecté"))
    .catch(err => console.log(err));
    
// Routes 
app.use('/client', require('./routes/clientRoute'));
app.use('/manager', require('./routes/managerRoute'));
app.use('/mecanicien', require('./routes/mecanicienRoute'));
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`)); 
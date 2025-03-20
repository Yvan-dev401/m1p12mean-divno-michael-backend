
const bcrypt = require('bcrypt')
const Utilisateur = require('../models/Utilisateur')

async function Log(req, res) {
    const { username } = req.body;

    try {
        const user = await Utilisateur.findOne({ username }).select("+password")
        if (!user) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "Username n'existe pas"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            `${req.body.password}`, user.password
        )

        if (!isPasswordValid) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "Diso mot de passe"
            });
        }

        let options = {
            maxAge: 20 * 60 * 1000,
            httpOnly: false,
            secure: false,
            sameSite: 'lax', // Autorise les cookies pour les requêtes cross-origin
            // path: '/', 
        }

        const token = user.generateAccessJWT();
        res.cookie("SessionID", token, options);
        res.status(200).json({
            status: "success",
            data: user.role,
            message: "Successfully logged in"
        });
    } catch (err) {
        res.status(500).json({
            status: "failed",
            code: 500,
            data: [],
            message: "erreur 500"
        });
    }
}

async function Logout(req, res) {
    try {
      const options = {
        httpOnly: false, 
        secure: false,   
        sameSite: 'lax', 
        path: '/',       
      };

      res.clearCookie('SessionID', options);

      return res.status(200).json({ st: "yes", message: 'Déconnexion réussie' });
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
      return res.status(500).json({ st: "no", message: 'Erreur lors de la déconnexion' });
    }
  }


module.exports = { Log, Logout };
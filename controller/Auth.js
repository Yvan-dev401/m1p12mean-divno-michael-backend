const bcrypt = require('bcrypt');

async function Log(req, res) {
    const { username } = req.body;

    try {
        const user = await req.db.collection('utilisateurs').findOne({ username });
        console.log(user)
        if (!user) {
            return res.status(401).json({
                status: "failed",
                data: [user],
                message: "Username n'existe pas"
            });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: "failed",
                data: [user],
                message: "Diso mot de passe"
            });
        }

        // let options = {
        //     maxAge: 20 * 60 * 1000,
        //     httpOnly: false,
        //     secure: false,
        //     sameSite: 'lax', // Autorise les cookies pour les requêtes cross-origin
        // };

        const token = generateAccessJWT(user); // Assurez-vous d'avoir une fonction pour générer le JWT
        res.cookie("SessionID", token);
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
        // const options = {
        //     httpOnly: false,
        //     secure: false,
        //     sameSite: 'lax',
        //     path: '/',
        // };

        res.clearCookie("SessionID");

        return res.status(200).json({ st: "yes", message: 'Déconnexion réussie' });
    } catch (error) {
        console.error('Erreur lors de la déconnexion :', error);
        return res.status(500).json({ st: "no", message: 'Erreur lors de la déconnexion' });
    }
}

// Fonction pour générer le JWT (à adapter selon votre logique)
function generateAccessJWT(user) {
    // Implémentez la logique pour générer un JWT ici
    // Par exemple, en utilisant jsonwebtoken
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: user._id, role: user.role }, 'your_secret_key', { expiresIn: '20m' });
    return token;
}

module.exports = { Log, Logout };
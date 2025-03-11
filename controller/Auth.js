
const bcrypt = require('bcrypt')
const Utilisateur = require('../models/Utilisateur')

async function Log(req, res) {
    const {username} = req.body;

    try{
        const user = await Utilisateur.findOne({username}).select("+password")
        if(!user){
            return res.status(401).json({
                status: "failed",
                data: [], 
                message: "Email n'existe pas"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            `${req.body.password}` , user.password
        )

        if(!isPasswordValid){
            return res.status(401).json({
                status: "failed",
                data: [], 
                message: "Diso mot de passe"
            });
        }

        let options = {
            maxAge : 20 * 60 * 1000,
            httpOnly : true,
            secure: true,
            sameSite: "None",
        }

        const token = user.generateAccessJWT();
        res.cookie("SessionID", token, options);
        res.status(200).json({
            status: "success",
            data: [], 
            message: "Successfully logged in"
        });
    } catch(err){
        res.status(500).json({
            status: "failed",
            code: 500,
            data: [], 
            message: "erreur 500"
        });
    }
}


module.exports = {Log };

const bcrypt = require('bcrypt')
const Client = require('../models/Client')
const Manager = require('../models/Manager')
const Mecanicien = require('../models/Mecanicien')

async function LoginMecanicien(req, res) {
    const {username} = req.body;

    try{
        const mec = await Mecanicien.findOne({username}).select("+password")
        if(!mec){
            return res.status(401).json({
                status: "failed",
                data: [], 
                message: "Email n'existe pas"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            `${req.body.password}` , mec.password
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

        const token = mec.generateAccessJWT();
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


async function LoginManager(req, res) {
    const {username} = req.body;

    try{
        const manager = await Manager.findOne({username}).select("+password")
        if(!manager){
            return res.status(401).json({
                status: "failed",
                data: [], 
                message: "Email n'existe pas"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            `${req.body.password}` , manager.password
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

        const token = manager.generateAccessJWT();
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

async function Login(req, res) {
    const {username} = req.body;

    try{
        const client = await Client.findOne({username}).select("+password")
        if(!client){
            return res.status(401).json({
                status: "failed",
                data: [], 
                message: "Email n'existe pas"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            `${req.body.password}` , client.password
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

        const token = client.generateAccessJWT();
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

module.exports = { LoginManager, Login, LoginMecanicien };
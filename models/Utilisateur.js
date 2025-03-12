const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { SECRET_ACCESS_TOKEN } = require('../config')

const UtilisateurSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: false },
    role: { type: String, enum: ['client', 'mécanicien', 'manager'], required: true },
    specialite: {type: [String],  default: [], required: true },   
    disponible: { type: Boolean, default: true },
    telephone: { type: String, required: false },
    score: { type: Number , require: false },
    createdAt: { type: Date, default: Date.now },
    photo: { type: String, required: false }
});

UtilisateurSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) return next();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        })
    })
})

UtilisateurSchema.methods.generateAccessJWT = function () {
    let payload = {
        id: this._id,
    };

    return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
        expiresIn: '20m'
    })
}


module.exports = mongoose.model('User', UtilisateurSchema);
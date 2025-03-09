
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {SECRET_ACCESS_TOKEN} = require('../config')

// console.log("test",SAT)

const ClientSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true, select: false },
    nom_prenom : {type: String, required : true},
    telephone : {type: String, required : false},
    email : {type:String, required : true}

}, { timestamps: true 

});

ClientSchema.pre("save", function (next) {
    const user = this;

    if(!user.isModified("password")) return next();
    bcrypt.genSalt(10, (err, salt) => {
        if(err) return next(err);

        bcrypt.hash(user.password , salt , (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        })
    })
})

ClientSchema.methods.generateAccessJWT = function(){
    let payload = {
        id: this._id,
    };

    return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
        expiresIn: '20m'
    })
}

module.exports = mongoose.model('Client', ClientSchema);
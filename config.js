require('dotenv').config();

const {MONGO_URI, PORT , SECRET_ACCESS_TOKEN} = process.env

console.log("sf",PORT)

module.exports = { MONGO_URI, PORT , SECRET_ACCESS_TOKEN };
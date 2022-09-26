const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3030

// Importera dotenv och läs in .env-filen
require('dotenv').config()

// Skapa och öppna mongoose-connection till MongoDB Atlas
mongoose.connect(process.env.DB_URL)
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.on('open', () => console.log('Connected to DB'))

// Testa att detta funkar, ersätt sedan med egen kod
app.get('/', (req, res) => res.json("Det funkar!"))

const usersRouter = require('./routes/users')
app.use('/users', usersRouter)

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
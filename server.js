
// Vi måste importera express-modulen för att skapa en express-app
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3030

// We import dotenv and .env-file
require('dotenv').config()
console.log(process.env.DOTENV_WORKS)

mongoose.connect(process.env.DB_URL)
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.on('open', () => console.log('Connected to database'))

app.use(express.json())

// Middleware-funktioner
const runAlways = (req, res, next) => {
    res.locals.myVariable = 'hello from runAlways' // res.locals är ett bra ställe att spara lokala variabler
    console.log(`A request was made to ${req.path}`)
    next()
}
const runSometimes = (req, res, next) => {
    console.log(`sometimes`)
    next()
}

// app.use(middleWare) => denna körs för varje request
app.use(runAlways)

app.use('/static', express.static(__dirname + '/public'))

const usersRouter = require('./routes/users')
app.use('/users', usersRouter)

const cabinsRouter = require('./routes/cabins')
app.use('/cabins', cabinsRouter)

const bookingsRouter = require('./routes/bookings')
app.use('/bookings', bookingsRouter)

// app.use() också för att använda en router-modul

// app.listen startar upp vår express-server och lyssnar på requests på en viss port.
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
const express = require('express')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 3000
const cors = require('cors')

require('./config/db')()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

///// import routing 
const taskRoute = require('./routes/taskRoute')


///// Routing path
app.use('/api/tasks',taskRoute)

app.get('/', (req, res) => res.send("Hello World!!"))
app.listen(PORT, () => console.log(`Example app listening on  http://localhost:${PORT}`))
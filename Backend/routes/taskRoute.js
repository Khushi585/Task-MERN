const express = require("express")
const router = express.Router()
const { store, index, trash, update } = require('../controllers/taskController')
const app = require('express')()
app.post('/', store)

app.post('/', store)
app.get('/', index)
app.delete('/:id', trash)
app.put('/:id',update)
module.exports = app 
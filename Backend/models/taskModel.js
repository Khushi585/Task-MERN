const { Schema, model } = require("mongoose");
const common = require("./common");

const taskSchema = new Schema({
    title: common,
    description: common,
    date: {
        type: Date,
        ...common,
        default:Date.now()
    }
},
    {timestamps:true}
 )
const Task = model('Task', taskSchema)
module.exports = Task
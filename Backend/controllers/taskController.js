const Task = require("../models/taskModel")

//// insert
exports.store = (req, res) => {
    console.log(req.body)
    const { title, description, date } = req.body
    Task.create({ title, description, date })
        .then(() => {
            res.json({
                success: true,
                message: "task added"
            })

        })
        .catch(err => console.log(err))
}

//// get 
exports.index = async (req, res) => {
    await Task.find()
        .then((records) => {
            res.json({
                success: true,
                records
            })

        })

}


//// delete

exports.trash = async (req, res) => {
    await Task.findByIdAndDelete(req.params.id)
        .then(() => {
            res.json({
                success: true,
                message: "task deleted"
            })

        })
        .catch(err => console.log(err))
}

//// update 
exports.update = async (req, res) => {
    const { id } = req.params;
    const { title, description, date } = req.body
    await Task.findByIdAndUpdate(
        id,
        { title, description, date }
    )
        .then(() => {
            res.json({
                success: true,
                message: "task updated"
            })

        })
        .catch(err => console.log(err))
}
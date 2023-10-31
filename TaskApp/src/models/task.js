const mongoose = require("mongoose")
const bcrypt = require ( "bcrypt" );
const TaskSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:String,
        required:false,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
})

TaskSchema.pre("save", async function(next){

    next();
})

const Task = mongoose.model("Task",TaskSchema)

module.exports = Task
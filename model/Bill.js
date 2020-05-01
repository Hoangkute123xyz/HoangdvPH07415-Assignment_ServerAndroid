const mongoose = require('mongoose');

let Bill = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    products:{
        type: [Object],
        required: false
    },
    isDone:{
        type:Boolean,
        required:false,
        default:false
    }
});
module.exports=mongoose.model('bill',Bill,'bill');
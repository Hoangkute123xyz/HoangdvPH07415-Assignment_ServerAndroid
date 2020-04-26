const mongoose = require('mongoose');
const productTypeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type: String,
        required: false,
        default:''
    }
});

module.exports=ProducType = mongoose.model('product_type',productTypeSchema,'product_type');
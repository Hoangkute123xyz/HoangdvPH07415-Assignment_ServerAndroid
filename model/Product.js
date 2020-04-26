const mongoose = require('mongoose');

const Product = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    productType:{
        type: String,
        required: true,
    },
    amount:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    dayImport:{
        type:String,
        required:false,
        default:''
    },
    dayExpr:{
        type:String,
        required:false,
        default: ''
    },
    productThumb:{
        type:String,
        required:false,
        default:'/img/camera.png'
    }
});
module.exports=mongoose.model('product',Product,'product');
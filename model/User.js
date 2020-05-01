const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    role:{
        type:Number,
        default:1,
        required:false
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        required: false,
        default:'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ1P9NIBPbZvN_8V2uZ8cVfm4Rnwwel8_UF_89HT238qUQAOZ1p&usqp=CAU'
    },
    cart:{
        type:[String],
        required:false,
    }
});

module.exports = User = mongoose.model('user',userSchema,'user');

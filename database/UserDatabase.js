let User = require('../model/User');
let ProductDatabase = require('../database/ProductDatabase');
const Imgur =require('../component/Imgur');

const userDatabase = {
    register: async (data, callback) => {
        data.userName=data.userName.toLowerCase();
        const user = new User(data);
        await user.save().then(callback);
    },
    login: async (data) => {
       if (!data){
           return false;
       }
       if (!data.userName) return false;
       if (!data.password) return false;
        const user = await User.findOne({userName: data.userName.toLowerCase()}).lean();
        if (user)
            if (data.password === user.password) {
                if (!user.cart){
                    user['cart']=[]
                }
                return user;
            }
            else
                return false;
    },
    getUserByUserName:async (userName)=>{
        const user = await User.findOne({userName:userName}).lean();
        if (user){
            return user;
        } else{
            return false;
        }
    }, getUserById:async (id)=>{
        const user = await User.findOne({_id:id}).lean();
        if (user){
            return user;
        } else{
            return false;
        }
    },
    updateUser:async (user)=>{
        await User.deleteOne({_id:user._id});
        await new User(user).save();
    },
    getAllUser:async ()=>{
        return await User.find({role:1}).lean();
    },
    deleteUser:async (id)=>{
        await User.deleteOne({_id:id});
    },
    addToCart: async (productId,userCookie)=>{
        const product = await ProductDatabase.getProductById(productId);
        if (!product){
            return false;
            throw "false";
        }
        let user = await userDatabase.login(userCookie);
        if (!user){
            return false;
            throw "false";
        }
        if (!user.cart){
            await userDatabase.updateUser(user);
            user = await userDatabase.login(userCookie)
        }
        const index = user.cart.findIndex((value, index) => {return  value===productId});
        if (index<0){
            user.cart = user.cart.concat(productId);
        }
        const idArray = [];
        user.cart.forEach(value=>{
            idArray.push(value);
        });
        const products = await ProductDatabase.getProductByIdArray(idArray);
        await userDatabase.updateUser(user);
        return {user:user,products:products};
    },
    deleteProductOnCart: async (id,user)=>{
        user.cart=user.cart.filter(value=> {
            return value!==id;
        });
        await userDatabase.updateUser(user);
    },
    registerAPI:async (data)=>{
        const user = await userDatabase.getUserByUserName(data.userName);
        if (!user){
            data.userName=data.userName.toLowerCase();
            const newUser = new User(data);
            const resultUser = await newUser.save();
            resultUser['cart']=[];
            return resultUser
        } else {
            return false;
        }
    },
    changeAvatar:async (data)=>{
        if (data._id){
            const user = await User.findOne({_id:data._id}).lean();
            if (user){
                await Imgur.upLoadImage(data.imageData,value=>{
                    user.avatar =value.data.link
                });
                await userDatabase.updateUser(user);
                return user
            } else {
                return false
            }
        } else {
            return false
        }
    },
    getUserByArrayId:async (arrayId)=>{
        return await User.find({_id:{$in: arrayId}}).lean()
    }
};
module.exports = UserDataBase = userDatabase;
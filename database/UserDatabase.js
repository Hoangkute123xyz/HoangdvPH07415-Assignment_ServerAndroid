let User = require('../model/User');

const userDatabase = {
    register: async (data, callback) => {
        const user = new User(data);
        await user.save().then(callback);
    },
    login: async (data) => {
       if (!data){
           return false;
       }
        const user = await User.findOne({userName: data.userName}).lean();
        if (user)
            if (data.password === user.password)
                return user;
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
    }
};
module.exports = UserDataBase = userDatabase;
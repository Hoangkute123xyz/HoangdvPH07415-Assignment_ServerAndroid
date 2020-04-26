let imgur = require('imgur');
imgur.setClientId('9493d20a69bed38');
const ImgurHelper ={
    upLoadImage: async (data,callback)=>{
        await imgur.uploadBase64(data).then(callback).catch(err=>console.error(err.message));
    }
};
module.exports=ImgurHelper;
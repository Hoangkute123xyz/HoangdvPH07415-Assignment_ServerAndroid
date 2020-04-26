const ProductType = require('../model/ProductType');

let ProductTypeDatabase = {
    addProductType: async (data,callback)=>{
        delete data['_id'];
        const productType = new ProductType(data);
        await productType.save().then(callback);
    },
    getAllProductType:async ()=>{
        const productTypes = await ProductType.find({}).lean();
        if (productTypes){
            return productTypes;
        } else{
            return false;
        }
    },
    updateProductType: async (data)=>{
        await ProductType.deleteOne({_id:data._id});
        const productType=new ProductType(data);
        productType.save();
    },
    deleteProductTypeById:async (id)=>{
        await ProductType.deleteOne({_id:id});
    }
};
module.exports=ProductTypeDatabase;
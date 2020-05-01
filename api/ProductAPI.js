const ProductDatabase = require('../database/ProductDatabase');
const ProductTypeDatabase =  require('../database/ProductTypeDataBase');

const ProductAPI={
    create:(app)=>{
        app.get('/api/products',async (req,res)=>{
            const products = await ProductDatabase.getAllProduct();
            const productTypes = await ProductTypeDatabase.getAllProductType();
            res.send({status:200,products:products,productTypes:productTypes});
        })
    }
};
module.exports=ProductAPI;
const Product = require('../model/Product');
const Imgur = require('../component/Imgur');

const ProductDatabase = {
    addProduct: async (data) => {
        if (!data) {
            return false;
        }
        if (data.productThumb) {
            await Imgur.upLoadImage(data.productThumb, value => {
                data.productThumb = value.data.link;
            });
        } else {
            data.productThumb = '/img/camera.png';
        }
        delete data['_id'];
        const product = new Product(data);
        await product.save();
    },
    updateProduct: async (data) => {
        if (!data) {
            return false;
        }
        if (data.productThumb) {
            await Imgur.upLoadImage(data.productThumb, value => {
                data.productThumb = value.data.link;
            });
        } else {
            const currentProduct = await Product.findOne({_id: data._id});
            data.productThumb = currentProduct.productThumb;
        }
        const product = new Product(data);
        await Product.deleteOne({_id: data._id});
        await product.save();
    },
    deleteProduct: async (id) => {
        await Product.deleteOne({_id: id});
    },
    getAllProduct: async () => {
        return await Product.find({}).lean();
    },
    getProductById: async (id) => {
        const product = await Product.findOne({_id: id});
        if (product)
            return product;
        else
            return false;
    },
    getProductByIdArray:async (idArray)=>{
        const products = await Product.find({_id:{$in:idArray}}).lean();
        if(products)
            return products;
        else
            return false;
    }
};

module.exports = ProductDatabase;
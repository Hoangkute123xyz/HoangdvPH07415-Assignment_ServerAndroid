const UserDatabase = require('../database/UserDatabase');
const ProductDatabase = require('../database/ProductDatabase');

const UserAPI = {
    create: (app) => {
        app.get('/api/get-all-user', async (req, res) => {
            res.send(await UserDatabase.getAllUser());
        });
        app.post('/api/register', async (req, res) => {
            const body = req.body;
            delete body['_id'];
            const user = await UserDatabase.registerAPI(body);
            if (user) {
                res.send({status: 200, result: user})
            } else
                res.send({status: 400});
        });
        app.post('/api/login', async (req, res) => {
            const user = await UserDatabase.login(req.body);
            if (user) {
                if (!user.cart){
                    user['cart']=[]
                }
                res.send({status: 200, result: user});
            } else {
                res.send({status: 400, message: "Wrong userName or password"});
            }
        });
        app.post('/api/avatar', async (req, res) => {
            const user = await UserDatabase.changeAvatar(req.body);
            if (user) {
                res.send({status: 200, result: user});
            } else {
                res.send({status: 400, message: "Error"});
            }
        });
        app.post('/api/my-carts', async (req, res) => {
            const body = req.body;
            const user = await UserDatabase.login(body);
            if (user) {
                const products = await ProductDatabase.getProductByIdArray(user.cart);
                res.send({status: 200, products: products});
            } else {
                res.send({status: 400, message: 'Login Failed!!!'})
            }
        });
        app.post('/api/remove-cart',async (req,res)=>{
            const body=req.body;
            const id=body.id;
            const user = await UserDatabase.login(body);
            if (user && id){
                user.cart = user.cart.filter(value=>{
                   return value!==id;
                });
                await UserDatabase.updateUser(user);
                const products = await ProductDatabase.getProductByIdArray(user.cart);
                res.send({status:200,user:user,products:products});
            } else {
                res.send({status:400,message:"failed!!"});
            }
        });
        app.post('/api/add-cart',async (req,res)=>{
            const body=req.body;
            const id=body.id;
            const user = await UserDatabase.login(body);
            if (user && id){
                user.cart = user.cart.concat(id);
                await UserDatabase.updateUser(user);
                const products = await ProductDatabase.getProductByIdArray(user.cart);
                res.send({status:200,user:user,products:products});
            } else {
                res.send({status:400,message:"failed!!"});
            }
        })
    }
};

module.exports = UserAPI;
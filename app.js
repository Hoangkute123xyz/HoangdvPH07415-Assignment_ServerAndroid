let express = require('express');
let hbs = require('express-handlebars');
let cookies = require('cookie-parser');
let bodyParser = require('body-parser');
let UserDatabase = require('./database/UserDatabase');
let mongoose = require('mongoose');
let ProductTypeDatabase = require('./database/ProductTypeDataBase');
let Imgur = require('./component/Imgur');
let ProductDatabase = require('./database/ProductDatabase');
let app = express();
mongoose.connect(
    "mongodb+srv://admin:admin@cluster0-z06y9.mongodb.net/hoang?retryWrites=true&w=majority",
    {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true},
    r => {
    }
);
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookies());
app.engine('hbs', hbs({
    layoutsDir: __dirname + '/view',
    defaultLayout: '',
    extname: '.hbs',
    helpers: {
        json: (context)=> {
            return JSON.stringify(context)
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/view');
app.listen(8080);

const checkUser = async (req) => {
    const userCookie = req.cookies.user;
    if (userCookie) {
        const user = await UserDatabase.login(userCookie);
        if (user) {
            return user;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

app.get('/', async (req, res) => {
    const products = await ProductDatabase.getAllProduct();
    let user = await checkUser(req);
    const productTypes = await ProductTypeDatabase.getAllProductType();
    if (user) {
        res.render('home', {
            layout: 'layout',
            user: user,
            isLogin: true,
            productTypes: productTypes,
            isAdmin: user.role === 2,
            products: products
        });
    } else
        res.render('home', {layout: 'layout', productTypes: productTypes, products: products});
});

app.get('/logout', (req, res) => {
    res.clearCookie('user');
    res.redirect('/');
});

app.post('/', async (req, res) => {
    let body = req.body;
    body.userName = body.userName.toLowerCase();
    if (body.actionRegister) {
        const userCheck = await UserDatabase.getUserByUserName(body.userName);
        if (!userCheck){
            await UserDatabase.register(body, value => {
                res.cookie('user', {userName: value.userName, id: value._id, password: value.password});
                res.redirect('/');
            });
        } else{
            res.render('home', {layout: 'layout', isExistAccount: true});
        }

    } else {
        let user = await UserDatabase.login(body);
        if (user) {
            res.cookie('user', {userName: user.userName, id: user._id, password: user.password});
            res.redirect('/');
        } else {
            res.render('home', {layout: 'layout', isWrongPassword: true});
        }
    }
});

app.post('/addProductType', async (req, res) => {
    const user = await UserDatabase.login(req.cookies.user);
    if (user) {
        if (user.role === 2) {
            await ProductTypeDatabase.addProductType(req.body, value => {})
        }
    }
    res.redirect('/');
});

app.get('/profile', async (req, res) => {
    const user = await UserDatabase.login(req.cookies.user);
    const customers =await UserDatabase.getAllUser();
    if (user) {
        res.render('profile', {layout: 'layout', user: user, isLogin: true, isAdmin: user.role === 2,customers:customers});
    } else {
        res.redirect('/');
    }
});
app.post('/changeAvatar', async (req, res) => {
    const body = req.body;
    const user = await UserDatabase.login(req.cookies.user);
    if (user) {
        await Imgur.upLoadImage(body.avatarData, value => {
            if (value.success) {
                user.avatar = value.data.link;
                UserDatabase.updateUser(user);
            }
        });
    }
    res.redirect('/profile');
});
app.post('/updateUser', async (req, res) => {
    const body = req.body;
    const userCookie = req.cookies.user;
    const user = await UserDatabase.login(userCookie);
    if (user) {
        user.fullName = body.fullName;
        user.phoneNumber = body.phoneNumber;
        user.address = body.address;
        await UserDatabase.updateUser(user);
    }
    res.redirect('/profile');
});

app.post('/addProduct', async (req, res) => {
    const userCookie = req.cookies.user;
    const user = await UserDatabase.login(userCookie);
    if (user.password === userCookie.password && user.role === 2) {
        await ProductDatabase.addProduct(req.body);
    }
    res.redirect('/');
});

app.post('/deleteProduct', async (req, res) => {
    const userCookie = req.cookies.user;
    const user = await UserDatabase.login(userCookie);
    if (user) {
        if (user.password === userCookie.password && user.role === 2) {
            await ProductDatabase.deleteProduct(req.body.idDelete);
        }
    }
    res.redirect('/');
});
app.post('/updateProduct',async (req,res)=>{
   const userCookie =req.cookies.user;
   const user = await UserDatabase.login(userCookie);
   if (user){
       if (user.password===userCookie.password && user.role===2){
           await ProductDatabase.updateProduct(req.body);
       }
   }
   res.redirect('/');
});

app.post('/deleteProductType',async (req,res)=>{
    const userCookie =req.cookies.user;
    const user = await UserDatabase.login(userCookie);
    if (user){
        if (user.password===userCookie.password && user.role===2){
            await ProductTypeDatabase.deleteProductTypeById(req.body.idDelete);
        }
    }
    res.redirect('/');
});
app.post('/updateProductType',async (req,res)=>{
    const userCookie =req.cookies.user;
    const user = await UserDatabase.login(userCookie);
    if (user){
        if (user.password===userCookie.password && user.role===2){
            await ProductTypeDatabase.updateProductType(req.body);
        }
    }
    res.redirect('/');
});

app.post('/deleteUser',async (req,res)=>{
    const userCookie =req.cookies.user;
    const user = await UserDatabase.login(userCookie);
    if (user){
        if (user.password===userCookie.password && user.role===2){
            await UserDatabase.deleteUser(req.body.idDelete);
        }
    }
    res.redirect('/profile');
});
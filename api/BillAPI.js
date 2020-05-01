const BillDatabase = require('../database/BillDatabase');
const UserDatabase = require('../database/UserDatabase');
const ProductDatabase = require('../database/ProductDatabase');

const BillAPI={
    create:(app)=>{
        app.post('/api/add-bill',async (req,res)=>{
            const body = req.body;
            const user = await UserDatabase.getUserById(body.user);
            if (user){
                await BillDatabase.addBill(body);
                user.cart=[];
                await UserDatabase.updateUser(user);
                res.send({status:200,user:user});
            } else {
                res.send({status:400,message:'Login failed!'});
            }
        });
        app.post('/api/bills',async (req,res)=>{
            const body = req.body;
            const user = await UserDatabase.login(body);
            if (user){
                if (user.role===2){
                    const bills = await BillDatabase.getAllBill();
                    const userMap={};
                    const moneyMap={};
                    for (i=0;i<bills.length;i++){
                        const userValue = await UserDatabase.getUserById(bills[i].user);
                        userMap[userValue._id]=userValue;
                        const productIdArray=[];
                        bills[i].products.forEach(value=>{
                            productIdArray.push(value.id)
                        });
                        const products = await ProductDatabase.getProductByIdArray(productIdArray);
                        let moneyResult=0;
                        products.forEach((value,index)=>{
                           moneyResult+=value.price*bills[i].products[index].amount
                        });
                        moneyMap[bills[i]._id]=moneyResult;
                    }
                    res.send({status:200,bills:bills,userMap:userMap,moneyMap:moneyMap});
                } else {
                    res.send({status:400,message:"You are not access"})
                }
            } else {
                res.send({status:400,message:"Wrong password"})
            }
        });
        app.post('/api/check-bill',async (req,res)=>{
            const body = req.body;
            const user = await UserDatabase.login(body);
            if (user){
                if (user.role===2){
                    await BillDatabase.checkBill(body.id);
                    const bills = await BillDatabase.getAllBill();
                    const userMap={};
                    const moneyMap={};
                    for (i=0;i<bills.length;i++){
                        const userValue = await UserDatabase.getUserById(bills[i].user);
                        userMap[userValue._id]=userValue;
                        const productIdArray=[];
                        bills[i].products.forEach(value=>{
                            productIdArray.push(value.id)
                        });
                        const products = await ProductDatabase.getProductByIdArray(productIdArray);
                        let moneyResult=0;
                        products.forEach((value,index)=>{
                            moneyResult+=value.price*bills[i].products[index].amount
                        });
                        moneyMap[bills[i]._id]=moneyResult;
                    }
                    res.send({status:200,bills:bills,userMap:userMap,moneyMap:moneyMap});
                } else {
                    res.send({status:400,message:"You are not access"})
                }
            } else {
                res.send({status:400,message:"Wrong password"})
            }
        });
        app.post('/api/delete-bill',async (req,res)=>{
            const body = req.body;
            const user = await UserDatabase.login(body);
            if (user){
                if (user.role===2){
                    await BillDatabase.deleteBill(body.id);
                    const bills = await BillDatabase.getAllBill();
                    const userMap={};
                    const moneyMap={};
                    for (i=0;i<bills.length;i++){
                        const userValue = await UserDatabase.getUserById(bills[i].user);
                        userMap[userValue._id]=userValue;
                        const productIdArray=[];
                        bills[i].products.forEach(value=>{
                            productIdArray.push(value.id)
                        });
                        const products = await ProductDatabase.getProductByIdArray(productIdArray);
                        let moneyResult=0;
                        products.forEach((value,index)=>{
                            moneyResult+=value.price*bills[i].products[index].amount
                        });
                        moneyMap[bills[i]._id]=moneyResult;
                    }
                    res.send({status:200,bills:bills,userMap:userMap,moneyMap:moneyMap});
                } else {
                    res.send({status:400,message:"You are not access"})
                }
            } else {
                res.send({status:400,message:"Wrong password"})
            }
        })

    }
};
module.exports = BillAPI;
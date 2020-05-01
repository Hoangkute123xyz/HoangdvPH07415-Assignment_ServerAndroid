const Bill = require('../model/Bill');

const BillDatabase = {
    addBill: async (data) => {
        const bill = new Bill(data);
        await bill.save();
    },
    getAllBill: async () => {
        const bills = await Bill.find({}).lean();
        if (bills) {
            return bills
        } else {
            return false;
        }
    },
    deleteBill: async (id) => {
        await Bill.deleteOne({_id: id});
    }, updateBill: async (data) => {
        await Bill.deleteOne({_id: data._id});
        await BillDatabase.addBill(data);
    },
    checkBill: async (id) => {
        const bill = await Bill.findOne({_id: id}).lean();
        if (bill){
            bill.isDone = true;
            await BillDatabase.updateBill(bill);
        }
    }
};
module.exports = BillDatabase;
import { Router } from "express";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "../config/firebase";

const router= Router();
const firestore=getFirestore(app)

router.get('/',async(req,res)=>{
    try {
        const transactions = await getDocs(collection(firestore, 'transactions'));
        const data = transactions.docs;
        const hip: { id: string }[] = []; // Explicitly define the type of the 'hip' array
        data.map((item) => {
            const obj = item.data();
            
            hip.push({ id: item.id, ...obj });
        });
        return res.status(200).json({
            status: true,
            transactions:hip,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Server Error',
            error
        });
    }
})
router.get('/phone',async(req,res)=>{
    try {
        const { id } = req.query;

        const users = await getDocs(collection(firestore, 'users'));
        const docs=users.docs;
        const filter= docs.filter((item)=>item.id===id);
        const user=filter[0].data()
        if(user){
            return res.status(200).json({
                status:true,
                phone:user?.phone,
                email:user?.email
            })
        }
        else{
            return res.status(400).json({
                status: false,
                message: 'Not FOund Error',
                
            });
        }

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Server Error',
            error
        });
    }
})
router.get('/filter',async(req,res)=>{
    try {
        const { id } = req.query;
        const transactions = await getDocs(collection(firestore, 'transactions'));
        const data = transactions.docs;
        const hip: { id: string }[] = []; // Explicitly define the type of the 'hip' array
        data.map((item) => {
            const obj = item.data();
            
            hip.push({ id: item.id, ...obj });
        });
        const filtered=hip.filter((item:any)=>item.to===id);
        
        return res.status(200).json({
            status: true,
            transactions: filtered,
        });


    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Server Error',
            error
        });
    }
})
router.post('/withdraw',async(req,res)=>{
    try {
        const { amount, userId  } = req.body;

        // Create a new document in the 'withdraw' collection
        const withdrawRef = await addDoc(collection(firestore, 'withdraw'), {
            amount,
            userId,
            timestamp:Date.now(),
            approved:false,
        });

        return res.status(200).json({
            status: true,
            message: 'Withdrawal request submitted successfully',
            withdrawId: withdrawRef.id,
        });
        
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Server Error',
            error
        });
    }
});
router.put('/withdraw/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const withdrawRef = collection(firestore, 'withdraw');
        const merchantRef = collection(firestore, 'merchants');

        await updateDoc(doc(withdrawRef, id), {
            approved: true
        });

        const withdraw = await getDoc(doc(withdrawRef, id));
        const merchantId = withdraw?.data()?.userId;
        const merchant = await getDoc(doc(merchantRef, merchantId));
        const newBalance = merchant.data()?.balance - withdraw.data()?.amount;

        await updateDoc(doc(merchantRef, merchantId), {
            balance: newBalance
        });

        return res.status(200).json({
            status: true,
            message: 'Withdrawal request updated successfully',
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Server Error',
            error
        });
    }
});
export 
{
    router as Transactions
}
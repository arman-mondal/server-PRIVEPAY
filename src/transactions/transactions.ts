import { Router } from "express";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { app } from "../config/firebase";
import axios from 'axios';
import Razorpay from 'razorpay'

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
});











router.post('/addmoney',async(req,res)=>{
    try {
        const transaction = req.body;
        const YOUR_TEST_KEY_ID = 'rzp_test_Cu0nhAHBQWqLtK';
        const YOUR_TEST_KEY_SECRET = 'oW3EL6LRkIIvj78DSdrKoj8i';
        // const capturePayment=await axios.post('https://api.razorpay.com/v1/payments/pay_29QQoUBi66xm2f/capture')
        var instance = new Razorpay({ key_id: YOUR_TEST_KEY_ID, key_secret: YOUR_TEST_KEY_SECRET })
        const cap=await instance.payments.capture(transaction.id,transaction.amount,'INR')
        console.log(cap)
    const userRef = doc(firestore, 'users', transaction.to);
    const userSnapshot = await getDoc(userRef);
    const currentBalance = userSnapshot.data()?.balance;
    const newBalance = currentBalance + transaction.amount/100;
    await updateDoc(userRef, {
        balance: newBalance
    });
    const add = await addDoc(collection(firestore, 'transactions'), {
        amount:transaction.amount/100,
        from:'Add Money',
        timestamp:Date.now(),
        to:transaction.to,
        transactionID:transaction.id
    }); 
        return res.status(200).json({
            status:true,
            message:'Added',
    
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: 'Server Error',
            error
        });
    }
})
router.post('/add', async (req, res) => {
    try {
        const transaction = req.body;
        const YOUR_TEST_KEY_ID = 'rzp_test_Cu0nhAHBQWqLtK';
        const YOUR_TEST_KEY_SECRET = 'oW3EL6LRkIIvj78DSdrKoj8i';
        var instance = new Razorpay({ key_id: YOUR_TEST_KEY_ID, key_secret: YOUR_TEST_KEY_SECRET })
        const cap=await instance.payments.capture(transaction.id,transaction.amount,'INR')
        console.log(transaction)

        
        const promotionRef = await addDoc(collection(firestore, 'transactions'), {
            amount:transaction.amount/100,
            from:transaction.from,
            timestamp:Date.now(),
            to:transaction.to,
            transactionID:transaction.id
        }); 
        const userRef = doc(firestore, 'merchants', transaction.to);
        const userSnapshot = await getDoc(userRef);
        const currentBalance = userSnapshot.data()?.balance;
        const newBalance = currentBalance + transaction.amount/100;
        await updateDoc(userRef, {
            balance: newBalance
        });
        

        return res.status(200).json({
            status:true,
            message:'Added',
    
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: 'Server Error',
            error
        });
    }
})


router.post('/promotions', async (req, res) => {
    try {
        const PromotionData = req.body;
        console.log(PromotionData)

        const promotionRef = await addDoc(collection(firestore, 'promotions'), {
            merchantId: PromotionData.merchantId,
            bannerImage: PromotionData.bannerImg,
            timestamp: Date.now(),
          active:PromotionData.active,

        }); 
        return res.status(200).json({
            status:true,
            message:'Created',
            id:promotionRef.id
    
        })
        
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
router.get('/transactions/admin/', async (req, res) => {
    try {
       
        const transactions = await getDocs(collection(firestore, 'transactions'));
        const data = transactions.docs;
        const hip: any[] = []; // Explicitly define the type of the 'hip' array
        data.map((item) => {
            const obj = item.data();
            hip.push({ id: item.id, ...obj });
        });
        const merchants = await getDocs(collection(firestore, 'merchants'));
        const merchantData = merchants.docs;
        const merchanthip: any[] = []; // Explicitly define the type of the 'hip' array
        merchantData.map((item) => {
            const obj = item.data();
            merchanthip.push({ id: item.id, ...obj });
        });
        const users = await getDocs(collection(firestore, 'users'));
        const usersData = users.docs;
        const usership: any[] = []; // Explicitly define the type of the 'hip' array
        usersData.map((item) => {
            const obj = item.data();
            usership.push({ id: item.id, ...obj });
        });
        const finalData:any[]=[];
        
        hip.map((item)=>{
            const transa={
                id:item.id,
                transactionId:item.transactionID,
                amount:item.amount,
                timestamp:item.timestamp,
                from:(usership.filter(a=>a.id===item.from).length>0 ? usership.filter(a=>a.id===item.from)[0] ?? usership.filter(a=>a.id===item.from)[0] : merchanthip.filter(b=>b.id===item.from)[0] ??   merchanthip.filter(b=>b.id===item.from)[0]) ?? 'Add Money',
                to:usership.filter(a=>a.id===item.to).length>0 ? usership.filter(a=>a.id===item.to)[0] ?? usership.filter(a=>a.id===item.to)[0] : merchanthip.filter(b=>b.id===item.to)[0] ??   merchanthip.filter(b=>b.id===item.to)[0],
            }
            finalData.push(transa)
        })




          return res.status(200).json({
            status: true,
            debits:finalData
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: 'Server Error',
            error
        });
    }
})
router.get('/filter/user/', async (req, res) => {
    try {
        const { id } = req.query;
        const transactions = await getDocs(collection(firestore, 'transactions'));
        const data = transactions.docs;
        const hip: any[] = []; // Explicitly define the type of the 'hip' array
        data.map((item) => {
            const obj = item.data();
            hip.push({ id: item.id, ...obj });
        });
        const merchants = await getDocs(collection(firestore, 'merchants'));
        const merchantData = merchants.docs;
        const merchanthip: any[] = []; // Explicitly define the type of the 'hip' array
        merchantData.map((item) => {
            const obj = item.data();
            merchanthip.push({ id: item.id, ...obj });
        });

        const debitData:any[]=[];
        const creditData:any=[];
        const usersDebitTransactions=hip.filter(item=>item.from===id);
        const usersCreditTransactions=hip.filter(item=>item.to===id);
        
        usersCreditTransactions.map((item)=>{
            const transct={
                 id: item.id,
                transactionID: item.transactionID,
                from: 'Add Money',
                amount: item.amount,
                timestamp: item.timestamp
            }
            creditData.push(transct)

        })
        const getNameorPhone=(id:string)=>{
           const fin= merchanthip.filter(item=>item.id===id);
        
            return fin[0]
          
          
        }
        usersDebitTransactions.map((item)=>{
            const transct={
                 id: item.id,
                transactionID: item.transactionID,
                to:getNameorPhone(item.to) ,
                amount: item.amount,
                timestamp: item.timestamp
            }
            debitData.push(transct)

        })




          return res.status(200).json({
            status: true,
            credits: creditData,
            debits:debitData
        });
    } catch (error) {
        console.log(error)
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
        const hip:any[] = []; // Explicitly define the type of the 'hip' array
        data.map((item) => {
            const obj = item.data();
            
            hip.push({ id: item.id, ...obj });
        });
        const filtered=hip.filter((item:any)=>item.to===id);
        const users = await getDocs(collection(firestore, 'users'));
        const usersdata = users.docs;
        const usership: any[] = []; // Explicitly define the type of the 'hip' array
        usersdata.map((item) => {
            const obj = item.data();
            
            usership.push({ id: item.id, ...obj });
        });
        const finaldata:any[]=[];
        filtered.map((item)=>{
            const single={
                id:item.id,
                from:usership.filter(ite=>ite.id===item.from)[0].phone
            }
            finaldata.push({...item,from :usership.filter(ite=>ite.id===item.from)[0]?.phone===null? item.from : usership.filter(ite=>ite.id===item.from)[0]?.phone})
        })
        
        return res.status(200).json({
            status: true,
            transactions: finaldata,
        });


    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Server Error',
            error
        });
    }
})





router.get('/leaderboard/',async(req,res)=>{
    try {
        const userRef = await getDocs(collection(firestore, 'users'));
        const usersRef=userRef.docs;
        const users:any[] = []; // Explicitly define the type of the 'hip' array
        usersRef.map((item) => {
            const obj = item.data();
            
            users.push({ id: item.id, ...obj });
        });
        const transactionsRef = await getDocs(collection(firestore, 'transactions'));
        const data = transactionsRef.docs;
        const transactions:any[] = []; // Explicitly define the type of the 'hip' array
        data.map((item) => {
            const obj = item.data();
            
            transactions.push({ id: item.id, ...obj });
        });

        const finalData:any[]=[]
        users.map((item)=>{
            console.log(item.id)
            const totalSpendings=transactions.filter(a=>a.from ===item.id);
            console.log(totalSpendings)
            var totalSpending=0
            totalSpendings.map((spends)=>{
                console.log(spends)
                totalSpending=+totalSpending+spends.amount

            }) 
            const data={
                id:item.id,
                
                name:item.name,
                phone:item.phone,
                balance:item.balance,
                
                totalSpent:totalSpending
            }
            finalData.push(data)
        })


       
        return res.status(200).json({
            status: true,
            data:finalData
        });


    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Server Error',
            error
        });
    }
})

router.get('/referals/',async(req,res)=>{
    try {
        const { id } = req.query;
        const dataall:any[]=[]
        const transactions = await getDocs(collection(firestore, 'refferal'));
        const data = transactions.docs;
        const hip:any[] = []; // Explicitly define the type of the 'hip' array
        data.map((item) => {
            const obj = item.data();
            
            hip.push({ id: item.id, ...obj });
        });
        const filtered=hip.filter((item:any)=>item.refferedBy===id);
       const alldata=await filtered.map(async(item)=>{
        const transactionsRef = collection(firestore, 'transactions');
        const querySnapshot = await getDocs(query(transactionsRef, where('from', '==', item.user)));
        let totalSpent = 0;
        querySnapshot.forEach((doc) => {
            const transaction = doc.data();
            totalSpent += transaction.amount;
        });

        const queryRef = await doc(firestore,'users',item.user);
        const userRef=await getDoc(queryRef);
const usr:any=userRef.data()


        const user=
        dataall.push({
            name:usr.name ,
            phone:usr.phone,
            totalSpent :totalSpent ?? 0,

        })
        console.log(usr)
       return user

       })
      console.log(dataall)
        return res.status(200).json({
            status: true,
            data: dataall,
        });


    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Server Error',
            error
        });
    }
})
router.get('/userdata/',async(req,res)=>{
    try {
        const { id } = req.query;
        const transactions = await getDocs(collection(firestore, 'users'));
        const data = transactions.docs;
        const hip:any[] = []; // Explicitly define the type of the 'hip' array
        data.map((item) => {
            const obj = item.data();
            
            hip.push({ id: item.id, ...obj });
        });
        const filtered=hip.filter((item:any)=>item.id===id);
      
        
        return res.status(200).json({
            status: true,
            user: filtered[0],
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

router.get('/withdraw',async(req,res)=>{
    try {
        

        // Create a new document in the 'withdraw' collection
        const withdrawRef = await getDocs(collection(firestore, 'withdraw'));
        const hip:any[]=[]
        const data=withdrawRef.docs;
        const users = await getDocs(collection(firestore, 'merchants'));
        const usersdata = users.docs;
        const usership: any[] = []; // Explicitly define the type of the 'hip' array
        usersdata.map((item) => {
            const obj = item.data();
            
            usership.push({ id: item.id, ...obj });
        });
 console.log(usership)
        data.map((item)=>{
            const a=item.data()
           const newItem={
            id:item.id,
            timestamp:a.timestamp,
            approved:a.approved,
            amount:a.amount,
            userId:usership.filter(d=>d.id==a.userId)[0]?.name ?? 'Merchant Deleted '+a.userId
           }
           hip.push(newItem)
        })

        return res.status(200).json({
            status: true,
            withdraws:hip,
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
import { Router } from "express";
import {createUserWithEmailAndPassword, getAuth,signInWithEmailAndPassword} from 'firebase/auth';
import {getFirestore,addDoc,collection,getDoc, doc, setDoc, getDocs, updateDoc} from 'firebase/firestore'
import {app} from '../config/firebase';
const router=Router();
import express from 'express'
import path from "path";
const auth=getAuth(app);
const firestore = getFirestore(app);

router.post('/merchant', async (req, res) => {
    try {
        const { phone, uid ,name} = req.body;
       const construct={
        active: false,
        name:'',
        images:[],
        address:'',
        closingTime:0,
        openingTime:0,
        upi:'',
        category:'Events',
        offertype:'Cashback',
        Price:0,
        fromTime:0,
        duration:0,
        ageLimit:0,
        availableTickets:0,
        startingDate:0,





    
       
        verified: true,
        phone: phone,
        
        balance: 0,
       
    }
        
        const userRecord = await getDoc(doc(collection(firestore, 'merchants'), uid));
        if (userRecord.exists()) {
           return res.status(400).json({
            status:false,
            message:'You Already Have and Account'
           })
        } else { const docRef = doc(collection(firestore, 'merchants'), uid); // Assuming `uid` is the desired document ID
        await setDoc(docRef, construct); // Set document data with phone number

        return res.status(200).json({
            status: true,
            message: 'Merchant created successfully',
            data: {
                docId: docRef.id
            },
        });
        }
       
        

        

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Server Error',
            error
        });
    }
});
function generateReferCode(): string {
    const length = 6;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let referCode = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        referCode += characters[randomIndex];
    }

    return referCode;
}


router.post('/user/:id', async (req, res) => {
    try {
        const {id} = req.params;
       
       



        const currentUser=[]
        const userRef = await getDocs(collection(firestore, 'users')); 
        const users=userRef.docs.filter(item=>item.data().id===id);
        return res.status(200).json({
            status:true,
            message:'Created',
            user:users[0]
    
        })
        
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Server Error',
            error
        });
    }
})


// router.post('/saved/:id', async (req, res) => {
//     try {
//         const {id} = req.params;
       
       



//         const currentUser=[]
//         const transactionsRef = await getDocs(collection(firestore, 'transactions')); 
//         const transactions=transactionsRef.docs.filter(item=>item.data().from===id);





//         return res.status(200).json({
//             status:true,
//             message:'Created',
//             user:users[0]
    
//         })
        
//     } catch (error) {
//         return res.status(500).json({
//             status: false,
//             message: 'Server Error',
//             error
//         });
//     }
// })



router.post('/usercreate/', async (req, res) => {
    try {
        const {phone,uid} = req.body;
       
        const referCode = generateReferCode();
        const userData={
            balance:0,
            email:'',
            name:'',
            phone:phone,
            photo:'',
            referalCode:referCode
        }




        const userRef = await setDoc(doc(collection(firestore, 'users'), uid), {
            balance:0,
            email:'',
            name:'',
            phone:phone,
            photo:'',
            referalCode:referCode

        }); 
        
        console.log({
            uid:uid,
            balance:0,
            email:'',
            name:'',
            phone:phone,
            photo:'',
            referalCode:referCode
        })
        return res.status(200).json({
            status:true,
            message:'a',
    
        })
        
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Server Error',
            error
        });
    }
})
router.put('/user/:id',async(req,res)=>{
    try {
        const docID = req.params.id;
        const {name,photo}=req.body;
        const construct = {
           "name":name,
           "photo":photo
        };
        console.log(construct)
        const docRef = doc(collection(firestore, 'users'), docID);
        await updateDoc(docRef, construct);
        return res.status(200).json({
            status:true,
            message:'Updated',
            
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

router.put('/update/:id',async(req,res)=>{
    try {
        const docID = req.params.id;
        const construct = {
            "description": req.body.description,
            "offers": req.body.offers,
            "category": req.body.category,
            "images": req.body.images,
            "address": req.body.address,
            "offertype":req.body.offertype,
            "reviews": [],
            "upi": req.body.upi,
            "active": true,
            "openingTime": req.body.openingTime,
            "closingTime":req.body.closingTime,
            "name":req.body.name,
            "Price":Number.isNaN(Number(req.body.price)) ? 0: Number(req.body.price) ,
            fromTime:Number(req.body.fromTime),
            duration:Number(req.body.duration),
            ageLimit:Number(req.body.ageLimit),
            availableTickets:Number(req.body.availableTickets),
            startingDate:Number(req.body.startingDate),
            
        };
        console.log(construct)
        const docRef = doc(collection(firestore, 'merchants'), docID);
        await updateDoc(docRef, construct);
        return res.status(200).json({
            status:true,
            message:'Updated',
            
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

router.get('/merchants',async(req,res)=>{
    try {
        const querySnapshot = await getDocs(collection(firestore, 'merchants'));
        const main: { id: string }[] = []; // Define the type of the 'main' array
        const data = querySnapshot.docs.map((doc) => {
            const obj = doc.data();
            main.push({
                ...obj,
                id: doc.id,
            });
        });
        return res.status(200).json({
            status:true,
            merchants:main,
            message:'Fetched'
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Server Error',
            error
        });
    }
})

router.get('/promolist',async(req,res)=>{
    try {
        const querySnapshot = await getDocs(collection(firestore, 'promotions'));
        const main: { id: string }[] = []; // Define the type of the 'main' array
        const data = querySnapshot.docs.map((doc) => {
            const obj = doc.data();
            main.push({
                ...obj,
                id: doc.id,
            });
        });
        return res.status(200).json({
            status:true,
            promos:main,
            message:'Fetched'
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Server Error',
            error
        });
    }
})
router.get('/merchants/:uid',async(req,res)=>{
    try {
        const {uid}=req.params;
        const querySnapshot = await getDocs(collection(firestore, 'merchants'));
        const main: { id: string }[] = []; // Define the type of the 'main' array
        const data = querySnapshot.docs.map((doc) => {
            const obj = doc.data();
            main.push({
                ...obj,
                id: doc.id,
            });
        });
        const merchant=main.filter(item=>item.id===uid);
        console.log(merchant[0])
        return res.status(200).json({
            status:true,
            merchant:merchant[0],
            message:'Fetched'
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Server Error',
            error
        });
    }
})
router.get('/user/:id',async(req,res)=>{
    try {
        const id=req.params.id;
        const docRef = doc(collection(firestore, 'merchants'), id);
        const data = await getDoc(docRef);
        const user=data.data();
        if(!user){
            return res.status(500).json({
                status: false,
                message: 'Merchant Not Found',
                
            }); 
        }
        if(user){
            return res.status(200).json({
                status: true,
                message: 'User Fetched',
                user
                
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

export {
    router as Auth
}
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
        name:name,
    
       
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
router.put('/update/:id',async(req,res)=>{
    try {
        const docID = req.params.id;
        const construct = {
            "description": req.body.description,
            "offers": req.body.offers,
            "category": req.body.category,
            "gallery": req.body.gallery,
            "address": req.body.address,
            "reviews": [],
            "mainImage": req.body.mainImage,
            "upi": req.body.upi,
            "active": true,
            "openingHours": req.body.openingHours,
        };
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
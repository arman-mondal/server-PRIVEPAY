import {
    Box,
    Button,
    Checkbox,
    Container,
    Divider,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Image,
    Input,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    PinInput,
    PinInputField,
    Stack,
    Text,
  } from '@chakra-ui/react'
  import { CheckCircleIcon } from '@chakra-ui/icons'

  import { Logo } from './Logo'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from '@firebase/auth'
  import { useEffect, useState } from 'react'
  import { collection, addDoc, getDocs, query, where, doc, setDoc } from '@firebase/firestore';
import { app, db } from './firebase'
import {useParams} from 'react-router-dom'
//   import { OAuthButtonGroup } from './OAuthButtonGroup'
//   import { PasswordField } from './PasswordField'

  export  const SignUp = () => {
    const {code}=useParams()
    const [otpsent,setotpsent]=useState(false);
    const [phone,setphone]=useState('')
    const [confirm,setconfirm]=useState(null)
    const [otp,setotp]=useState()
    const auth = getAuth(app);
    const [user,setuser]=useState()
    const [friend,setfriend]=useState()
  const [modal,setmodal]=useState(false)
    const handlePhoneSubmit = async () => {
        try {

          const appVerifier = window.recaptchaVerifier;

            const response = await signInWithPhoneNumber(auth, '+91'+phone, appVerifier);

            setotpsent(true);
            setconfirm(response)
            console.log(response)
        } catch (error) {
            console.log(error);
            return error;
        }
    }
      useEffect(()=>{
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {});
        // const refercode
        const fetchData = async () => {
       
          const querySnapshot = await getDocs(collection(db, "users"), where("referalCode", "==", code));
          const data=[]
          querySnapshot.docs.map((item) => {
            data.push({ id: item.id, ...item.data() });
          });
          console.log(data)
          const friend=data.filter((item)=>item.referalCode===code)
          setfriend(friend[0])
          if(friend.length==0){
            alert('No Friend Found')

          }


          
        };
        fetchData()

      },[code])
      const generateReferCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let referCode = '';
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            referCode += characters[randomIndex];
        }
        return referCode;
    }
 
    // // Define the signUp function
    // const signUp = async (email, password) => {
    //    const  additionalData={
    //     balance:0,
    //     referalCode:generateReferCode(),

    //     }
    //     try {
    //         const { user } = await auth().createUserWithEmailAndPassword(email, password);
    //         await saveUserData(user, additionalData);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const saveUserData = async (user, additionalData) => {
        try {
          const docID=user.uid;
         const task = await setDoc(doc(db, "users", docID), {

          name:user.displayName,
          email:user.email,
          photo:user.photoURL,
          phone:user.phoneNumber,
          emailVerified:user.emailVerified,
          ...additionalData
        });
        
        console.log('Document written with ID: ');
         console.log('User data saved to Firestore',task);
        } catch (error) {
            console.log('Error hAPPENDED'+error);
        }
    };
     
      const loadData = async (data) => {
        try {
          const docRef = await addDoc(collection(db, 'refferal'), data);
          console.log('Document written with ID: ', docRef.id);
        } catch (error) {
          console.error('Error adding document: ', error);
          return error;
        }
      }
    
    const handleVerify=async()=>{
      try {
        
        const user=await confirm.confirm(otp);
        setuser(user.user)
        console.log(user.user)
  
        const  additionalData={
              balance:0,
              referalCode:generateReferCode(),
      
              }
        saveUserData(user.user,additionalData);

      const data={
          refferedBy:friend.id,
          user:user.user.uid,
          timeStamp:Date.now()
        }
        loadData(data)


        triggerModal()
        setotpsent(false)
      } catch (error) {
        console.log(error)
        return error
      }
    }
const triggerModal=()=>{
  setmodal(!modal)
}
    return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
      <Modal isOpen={modal} onClose={triggerModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Success</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* <Lorem count={2} /> */}
            <Box display={'flex'} alignItems={'center'} flexDirection={'column'} >
              <CheckCircleIcon boxSize={20} />
            <Image mt={5} src={require('./appstore.png')} borderRadius={15} height={100} width={100} />
            <Text mt={2} fontSize={20} fontWeight={'bold'}>Download Our App</Text>
            <Box display={'flex'} flexDirection={'row'}  gap={10}>
              <Box width={150}height={100} >
              <Image cursor={'pointer'} src='https://www.svgrepo.com/show/303139/google-play-badge-logo.svg' />

              </Box>
              <Box width={150} height={100}>

              <Image cursor={'pointer'} src='https://www.svgrepo.com/show/303128/download-on-the-app-store-apple-logo.svg' width={150}/>
</Box>
            </Box>

            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={triggerModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Stack spacing="8">
        <Stack spacing="6">
            <Box display={'flex'} justifyContent={'center'} >
            <Image src={require('./appstore.png')} height={100} width={100} borderRadius={15} />
</Box>
          <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
            <Heading>Sign Up</Heading>
            {/* <Text color="fg.muted">
              Don't have an account? <Link href="#">Sign up</Link>
            </Text> */}
          </Stack>
        </Stack>
        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={{ base: 'transparent', sm: 'bg.surface' }}
          boxShadow={{ base: 'none', sm: 'md' }}
          borderRadius={{ base: 'none', sm: 'xl' }}
        >
        {otpsent ?  <Stack spacing="6">
            <Stack spacing="5">
              <FormControl>
                <FormLabel htmlFor="email">Enter OTP</FormLabel>
                <HStack width={'100%'} display={'flex'} justifyContent={'center'}>
  <PinInput onChange={(e)=>{
setotp(e)
  }}>
    <PinInputField />
    <PinInputField />
    <PinInputField />
    <PinInputField />
    <PinInputField />
    <PinInputField />
  </PinInput>
</HStack>
              </FormControl>
              {/* <PasswordField /> */}
            </Stack>
            <HStack justify="space-between">
              {/* <Checkbox defaultChecked>Remember me</Checkbox> */}
              {/* <Button variant="text" size="sm">
                Forgot password?
              </Button> */}
            </HStack>
            <Stack spacing="6">
              <Button onClick={handleVerify} colorScheme='green'>Verify</Button>
              
              {/* <OAuthButtonGroup /> */}
            </Stack>
          </Stack>:
            <Stack spacing="6">
          <Stack spacing="5">
            <FormControl>
              <FormLabel htmlFor="phone">Phone</FormLabel>
              <Input  value={phone} onChange={(e)=>{
                if(e.target.value.length>10){
                  e.target.style.borderColor='red'
                  
                  setphone(e.target.value)                }
                if(e.target.value.length<10){
                  e.target.style.borderColor='red'
                  
                setphone(e.target.value)
                }
                if(e.target.value.length===10){
                  e.target.style.borderColor='green'

                setphone(e.target.value)
                }
              }} id="phone" type='number' />
            </FormControl>
            {/* <PasswordField /> */}
          </Stack>
          <Box id="recaptcha-container"></Box>

          <HStack justify="space-between">
            {/* <Checkbox defaultChecked>Remember me</Checkbox> */}
            {/* <Button variant="text" size="sm">
              Forgot password?
            </Button> */}
          </HStack>
          <Stack spacing="6">
            <Button onClick={handlePhoneSubmit} colorScheme='green'>Continue</Button>
            
            {/* <OAuthButtonGroup /> */}
          </Stack>
        </Stack>

        }
        </Box>
      </Stack>
    </Container>
  )
}
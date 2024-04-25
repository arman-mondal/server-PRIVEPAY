import express, { Request } from "express"
import * as dotevnv from "dotenv"
import cors from "cors"
import { Auth } from "./auth"
dotevnv.config()
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { Transactions } from "./transactions/transactions"

const PORT = 4045;

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors({ origin: "*" }))

app.use('/auth',Auth)
app.use('/transactions',Transactions)
const storage = multer.diskStorage({
  
    destination: function (req:any, file:any, cb:any) {
        cb(null, 'uploads/');
    },
    filename: function (req:any, file:any, cb:any) {
        const randomFileName = uuidv4() + path.extname(file.originalname);
        cb(null, randomFileName);
    }
  });
  
  const upload = multer({ storage: storage , limits: {
    fileSize: 10 * 1024 * 1024, // Increase file size limit to 10MB (adjust as needed)
    fieldSize: 10 * 1024 * 1024, // Increase field size limit to 10MB (adjust as needed)
    // Other limits if needed
  }});
  
  app.post('/upload', upload.single('file'), (req:any, res) => {
    if (req.file) {
        const fileUrl = `http://localhost:4045/uploads/${req.file.filename}`;
        res.json({ fileUrl: fileUrl });
    } else {
        res.status(400).json({ error: 'No file uploaded' });
    }
  });
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})
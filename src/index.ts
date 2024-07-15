import express, { Request } from "express";
import * as dotevnv from "dotenv";
import cors from "cors";
import { Auth } from "./auth";
import https from "https";
import fs from "fs";
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { Transactions } from "./transactions/transactions";

dotevnv.config();

const PORT = 9090;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

app.use('/auth', Auth);
app.use('/transactions', Transactions);

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, 'uploads/');
  },
  filename: function (req: any, file: any, cb: any) {
    const randomFileName = uuidv4() + path.extname(file.originalname);
    cb(null, randomFileName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Increase file size limit to 10MB (adjust as needed)
    fieldSize: 10 * 1024 * 1024, // Increase field size limit to 10MB (adjust as needed)
    // Other limits if needed
  }
});

app.post('/upload', upload.single('file'), (req: any, res) => {
  if (req.file) {
    const fileUrl = `https://api.techarman.me:9090/uploads/${req.file.filename}`;
    res.json({ fileUrl: fileUrl });
  } else {
    res.status(400).json({ error: 'No file uploaded' });
  }
});

app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const options = {
  key: fs.readFileSync('/ssl/private.key'),
  cert: fs.readFileSync('/ssl/certificate.crt'),
  ca: fs.readFileSync('/ssl/ca_bundle.crt')
};

https.createServer(options, app).listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dotevnv = require("dotenv");
var cors_1 = require("cors");
var auth_1 = require("./auth");
dotevnv.config();
var multer_1 = require("multer");
var uuid_1 = require("uuid");
var path_1 = require("path");
var transactions_1 = require("./transactions/transactions");
var PORT = 9090;
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({ origin: "*" }));
app.use('/auth', auth_1.Auth);
app.use('/transactions', transactions_1.Transactions);
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        var randomFileName = (0, uuid_1.v4)() + path_1.default.extname(file.originalname);
        cb(null, randomFileName);
    }
});
var upload = (0, multer_1.default)({ storage: storage, limits: {
        fileSize: 10 * 1024 * 1024, // Increase file size limit to 10MB (adjust as needed)
        fieldSize: 10 * 1024 * 1024, // Increase field size limit to 10MB (adjust as needed)
        // Other limits if needed
    } });
app.post('/upload', upload.single('file'), function (req, res) {
    if (req.file) {
        var fileUrl = "https://api.techarman.me/uploads/".concat(req.file.filename);
        res.json({ fileUrl: fileUrl });
    }
    else {
        res.status(400).json({ error: 'No file uploaded' });
    }
});
app.use('/public', express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.listen(PORT, function () {
    console.log("Server is listening on port ".concat(PORT));
});

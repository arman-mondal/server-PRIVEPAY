"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
var express_1 = require("express");
var auth_1 = require("firebase/auth");
var firestore_1 = require("firebase/firestore");
var firebase_1 = require("../config/firebase");
var router = (0, express_1.Router)();
exports.Auth = router;
var auth = (0, auth_1.getAuth)(firebase_1.app);
var firestore = (0, firestore_1.getFirestore)(firebase_1.app);
router.post('/merchant', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, phone, uid, name_1, construct, userRecord, docRef, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, phone = _a.phone, uid = _a.uid, name_1 = _a.name;
                construct = {
                    active: false,
                    name: name_1,
                    verified: true,
                    phone: phone,
                    balance: 0,
                };
                return [4 /*yield*/, (0, firestore_1.getDoc)((0, firestore_1.doc)((0, firestore_1.collection)(firestore, 'merchants'), uid))];
            case 1:
                userRecord = _b.sent();
                if (!userRecord.exists()) return [3 /*break*/, 2];
                return [2 /*return*/, res.status(400).json({
                        status: false,
                        message: 'You Already Have and Account'
                    })];
            case 2:
                docRef = (0, firestore_1.doc)((0, firestore_1.collection)(firestore, 'merchants'), uid);
                return [4 /*yield*/, (0, firestore_1.setDoc)(docRef, construct)];
            case 3:
                _b.sent(); // Set document data with phone number
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        message: 'Merchant created successfully',
                        data: {
                            docId: docRef.id
                        },
                    })];
            case 4: return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Server Error',
                        error: error_1
                    })];
            case 6: return [2 /*return*/];
        }
    });
}); });
function generateReferCode() {
    var length = 6;
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var referCode = "";
    for (var i = 0; i < length; i++) {
        var randomIndex = Math.floor(Math.random() * characters.length);
        referCode += characters[randomIndex];
    }
    return referCode;
}
router.post('/user/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id_1, currentUser, userRef, users, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id_1 = req.params.id;
                currentUser = [];
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(firestore, 'users'))];
            case 1:
                userRef = _a.sent();
                users = userRef.docs.filter(function (item) { return item.data().id === id_1; });
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        message: 'Created',
                        user: users[0]
                    })];
            case 2:
                error_2 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Server Error',
                        error: error_2
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/user/create', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var phone, referCode, userData, userRef, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                phone = req.body.phone;
                referCode = generateReferCode();
                userData = {
                    balance: 0,
                    email: '',
                    name: '',
                    phone: phone,
                    photo: '',
                    referalCode: referCode
                };
                return [4 /*yield*/, (0, firestore_1.addDoc)((0, firestore_1.collection)(firestore, 'users'), {
                        balance: 0,
                        email: '',
                        name: '',
                        phone: phone,
                        photo: '',
                        referalCode: referCode
                    })];
            case 1:
                userRef = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        message: 'Created',
                    })];
            case 2:
                error_3 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Server Error',
                        error: error_3
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.put('/update/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var docID, construct, docRef, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                docID = req.params.id;
                construct = {
                    "description": req.body.description,
                    "offers": req.body.offers,
                    "category": req.body.category,
                    "images": req.body.images,
                    "address": req.body.address,
                    "offertype": req.body.offertype,
                    "reviews": [],
                    "upi": req.body.upi,
                    "active": true,
                    "openingTime": req.body.openingTime,
                    "closingTime": req.body.closingTime,
                    "name": req.body.name,
                };
                console.log(construct);
                docRef = (0, firestore_1.doc)((0, firestore_1.collection)(firestore, 'merchants'), docID);
                return [4 /*yield*/, (0, firestore_1.updateDoc)(docRef, construct)];
            case 1:
                _a.sent();
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        message: 'Updated',
                    })];
            case 2:
                error_4 = _a.sent();
                console.log(error_4);
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Server Error',
                        error: error_4
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/merchants', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var querySnapshot, main_1, data, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(firestore, 'merchants'))];
            case 1:
                querySnapshot = _a.sent();
                main_1 = [];
                data = querySnapshot.docs.map(function (doc) {
                    var obj = doc.data();
                    main_1.push(__assign(__assign({}, obj), { id: doc.id }));
                });
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        merchants: main_1,
                        message: 'Fetched'
                    })];
            case 2:
                error_5 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Server Error',
                        error: error_5
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/promolist', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var querySnapshot, main_2, data, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(firestore, 'promotions'))];
            case 1:
                querySnapshot = _a.sent();
                main_2 = [];
                data = querySnapshot.docs.map(function (doc) {
                    var obj = doc.data();
                    main_2.push(__assign(__assign({}, obj), { id: doc.id }));
                });
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        promos: main_2,
                        message: 'Fetched'
                    })];
            case 2:
                error_6 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Server Error',
                        error: error_6
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/merchants/:uid', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var uid_1, querySnapshot, main_3, data, merchant, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                uid_1 = req.params.uid;
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(firestore, 'merchants'))];
            case 1:
                querySnapshot = _a.sent();
                main_3 = [];
                data = querySnapshot.docs.map(function (doc) {
                    var obj = doc.data();
                    main_3.push(__assign(__assign({}, obj), { id: doc.id }));
                });
                merchant = main_3.filter(function (item) { return item.id === uid_1; });
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        merchant: merchant[0],
                        message: 'Fetched'
                    })];
            case 2:
                error_7 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Server Error',
                        error: error_7
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/user/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, docRef, data, user, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                docRef = (0, firestore_1.doc)((0, firestore_1.collection)(firestore, 'merchants'), id);
                return [4 /*yield*/, (0, firestore_1.getDoc)(docRef)];
            case 1:
                data = _a.sent();
                user = data.data();
                if (!user) {
                    return [2 /*return*/, res.status(500).json({
                            status: false,
                            message: 'Merchant Not Found',
                        })];
                }
                if (user) {
                    return [2 /*return*/, res.status(200).json({
                            status: true,
                            message: 'User Fetched',
                            user: user
                        })];
                }
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Server Error',
                        error: error_8
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); });

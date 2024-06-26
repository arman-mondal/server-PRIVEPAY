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
exports.Transactions = void 0;
var express_1 = require("express");
var firestore_1 = require("firebase/firestore");
var firebase_1 = require("../config/firebase");
var razorpay_1 = require("razorpay");
var router = (0, express_1.Router)();
exports.Transactions = router;
var firestore = (0, firestore_1.getFirestore)(firebase_1.app);
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var transactions, data, hip_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(firestore, 'transactions'))];
            case 1:
                transactions = _a.sent();
                data = transactions.docs;
                hip_1 = [];
                data.map(function (item) {
                    var obj = item.data();
                    hip_1.push(__assign({ id: item.id }, obj));
                });
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        transactions: hip_1,
                    })];
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Server Error',
                        error: error_1
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/addmoney', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var transaction, YOUR_TEST_KEY_ID, YOUR_TEST_KEY_SECRET, instance, cap, userRef, userSnapshot, currentBalance, newBalance, add, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                transaction = req.body;
                YOUR_TEST_KEY_ID = 'rzp_test_Cu0nhAHBQWqLtK';
                YOUR_TEST_KEY_SECRET = 'oW3EL6LRkIIvj78DSdrKoj8i';
                instance = new razorpay_1.default({ key_id: YOUR_TEST_KEY_ID, key_secret: YOUR_TEST_KEY_SECRET });
                return [4 /*yield*/, instance.payments.capture(transaction.id, transaction.amount, 'INR')];
            case 1:
                cap = _b.sent();
                console.log(cap);
                userRef = (0, firestore_1.doc)(firestore, 'users', transaction.to);
                return [4 /*yield*/, (0, firestore_1.getDoc)(userRef)];
            case 2:
                userSnapshot = _b.sent();
                currentBalance = (_a = userSnapshot.data()) === null || _a === void 0 ? void 0 : _a.balance;
                newBalance = currentBalance + transaction.amount / 100;
                return [4 /*yield*/, (0, firestore_1.updateDoc)(userRef, {
                        balance: newBalance
                    })];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, firestore_1.addDoc)((0, firestore_1.collection)(firestore, 'transactions'), {
                        amount: transaction.amount / 100,
                        from: 'Add Money',
                        timestamp: Date.now(),
                        to: transaction.to,
                        transactionID: transaction.id
                    })];
            case 4:
                add = _b.sent();
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        message: 'Added',
                    })];
            case 5:
                error_2 = _b.sent();
                console.log(error_2);
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Server Error',
                        error: error_2
                    })];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/add', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var transaction, YOUR_TEST_KEY_ID, YOUR_TEST_KEY_SECRET, instance, cap, promotionRef, userRef, userSnapshot, currentBalance, newBalance, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                transaction = req.body;
                YOUR_TEST_KEY_ID = 'rzp_test_Cu0nhAHBQWqLtK';
                YOUR_TEST_KEY_SECRET = 'oW3EL6LRkIIvj78DSdrKoj8i';
                instance = new razorpay_1.default({ key_id: YOUR_TEST_KEY_ID, key_secret: YOUR_TEST_KEY_SECRET });
                return [4 /*yield*/, instance.payments.capture(transaction.id, transaction.amount, 'INR')];
            case 1:
                cap = _b.sent();
                console.log(transaction);
                return [4 /*yield*/, (0, firestore_1.addDoc)((0, firestore_1.collection)(firestore, 'transactions'), {
                        amount: transaction.amount / 100,
                        from: transaction.from,
                        timestamp: Date.now(),
                        to: transaction.to,
                        transactionID: transaction.id
                    })];
            case 2:
                promotionRef = _b.sent();
                userRef = (0, firestore_1.doc)(firestore, 'merchants', transaction.to);
                return [4 /*yield*/, (0, firestore_1.getDoc)(userRef)];
            case 3:
                userSnapshot = _b.sent();
                currentBalance = (_a = userSnapshot.data()) === null || _a === void 0 ? void 0 : _a.balance;
                newBalance = currentBalance + transaction.amount / 100;
                return [4 /*yield*/, (0, firestore_1.updateDoc)(userRef, {
                        balance: newBalance
                    })];
            case 4:
                _b.sent();
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        message: 'Added',
                    })];
            case 5:
                error_3 = _b.sent();
                console.log(error_3);
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Server Error',
                        error: error_3
                    })];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/promotions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var PromotionData, promotionRef, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                PromotionData = req.body;
                console.log(PromotionData);
                return [4 /*yield*/, (0, firestore_1.addDoc)((0, firestore_1.collection)(firestore, 'promotions'), {
                        merchantId: PromotionData.merchantId,
                        bannerImage: PromotionData.bannerImg,
                        timestamp: Date.now(),
                        active: PromotionData.active,
                    })];
            case 1:
                promotionRef = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        message: 'Created',
                        id: promotionRef.id
                    })];
            case 2:
                error_4 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Server Error',
                        error: error_4
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/phone', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id_1, users, docs, filter, user, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id_1 = req.query.id;
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(firestore, 'users'))];
            case 1:
                users = _a.sent();
                docs = users.docs;
                filter = docs.filter(function (item) { return item.id === id_1; });
                user = filter[0].data();
                if (user) {
                    return [2 /*return*/, res.status(200).json({
                            status: true,
                            phone: user === null || user === void 0 ? void 0 : user.phone,
                            email: user === null || user === void 0 ? void 0 : user.email
                        })];
                }
                else {
                    return [2 /*return*/, res.status(400).json({
                            status: false,
                            message: 'Not FOund Error',
                        })];
                }
                return [3 /*break*/, 3];
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
router.get('/transactions/admin/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var transactions, data, hip_2, merchants, merchantData, merchanthip_1, users, usersData, usership_1, finalData_1, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(firestore, 'transactions'))];
            case 1:
                transactions = _a.sent();
                data = transactions.docs;
                hip_2 = [];
                data.map(function (item) {
                    var obj = item.data();
                    hip_2.push(__assign({ id: item.id }, obj));
                });
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(firestore, 'merchants'))];
            case 2:
                merchants = _a.sent();
                merchantData = merchants.docs;
                merchanthip_1 = [];
                merchantData.map(function (item) {
                    var obj = item.data();
                    merchanthip_1.push(__assign({ id: item.id }, obj));
                });
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(firestore, 'users'))];
            case 3:
                users = _a.sent();
                usersData = users.docs;
                usership_1 = [];
                usersData.map(function (item) {
                    var obj = item.data();
                    usership_1.push(__assign({ id: item.id }, obj));
                });
                finalData_1 = [];
                hip_2.map(function (item) {
                    var _a, _b, _c, _d, _e;
                    var transa = {
                        id: item.id,
                        transactionId: item.transactionID,
                        amount: item.amount,
                        timestamp: item.timestamp,
                        from: (_c = (usership_1.filter(function (a) { return a.id === item.from; }).length > 0 ? (_a = usership_1.filter(function (a) { return a.id === item.from; })[0]) !== null && _a !== void 0 ? _a : usership_1.filter(function (a) { return a.id === item.from; })[0] : (_b = merchanthip_1.filter(function (b) { return b.id === item.from; })[0]) !== null && _b !== void 0 ? _b : merchanthip_1.filter(function (b) { return b.id === item.from; })[0])) !== null && _c !== void 0 ? _c : 'Add Money',
                        to: usership_1.filter(function (a) { return a.id === item.to; }).length > 0 ? (_d = usership_1.filter(function (a) { return a.id === item.to; })[0]) !== null && _d !== void 0 ? _d : usership_1.filter(function (a) { return a.id === item.to; })[0] : (_e = merchanthip_1.filter(function (b) { return b.id === item.to; })[0]) !== null && _e !== void 0 ? _e : merchanthip_1.filter(function (b) { return b.id === item.to; })[0],
                    };
                    finalData_1.push(transa);
                });
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        debits: finalData_1
                    })];
            case 4:
                error_6 = _a.sent();
                console.log(error_6);
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Server Error',
                        error: error_6
                    })];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.get('/filter/user/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id_2, transactions, data, hip_3, merchants, merchantData, merchanthip_2, debitData_1, creditData_1, usersDebitTransactions, usersCreditTransactions, getNameorPhone_1, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id_2 = req.query.id;
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(firestore, 'transactions'))];
            case 1:
                transactions = _a.sent();
                data = transactions.docs;
                hip_3 = [];
                data.map(function (item) {
                    var obj = item.data();
                    hip_3.push(__assign({ id: item.id }, obj));
                });
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(firestore, 'merchants'))];
            case 2:
                merchants = _a.sent();
                merchantData = merchants.docs;
                merchanthip_2 = [];
                merchantData.map(function (item) {
                    var obj = item.data();
                    merchanthip_2.push(__assign({ id: item.id }, obj));
                });
                debitData_1 = [];
                creditData_1 = [];
                usersDebitTransactions = hip_3.filter(function (item) { return item.from === id_2; });
                usersCreditTransactions = hip_3.filter(function (item) { return item.to === id_2; });
                usersCreditTransactions.map(function (item) {
                    var transct = {
                        id: item.id,
                        transactionID: item.transactionID,
                        from: 'Add Money',
                        amount: item.amount,
                        timestamp: item.timestamp
                    };
                    creditData_1.push(transct);
                });
                getNameorPhone_1 = function (id) {
                    var fin = merchanthip_2.filter(function (item) { return item.id === id; });
                    if (fin[0].name === undefined) {
                        return fin[0].phone;
                    }
                    else {
                        return fin[0].name;
                    }
                };
                usersDebitTransactions.map(function (item) {
                    var transct = {
                        id: item.id,
                        transactionID: item.transactionID,
                        to: getNameorPhone_1(item.to),
                        amount: item.amount,
                        timestamp: item.timestamp
                    };
                    debitData_1.push(transct);
                });
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        credits: creditData_1,
                        debits: debitData_1
                    })];
            case 3:
                error_7 = _a.sent();
                console.log(error_7);
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Server Error',
                        error: error_7
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/filter', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id_3, transactions, data, hip_4, filtered, users, usersdata, usership_2, finaldata_1, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id_3 = req.query.id;
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(firestore, 'transactions'))];
            case 1:
                transactions = _a.sent();
                data = transactions.docs;
                hip_4 = [];
                data.map(function (item) {
                    var obj = item.data();
                    hip_4.push(__assign({ id: item.id }, obj));
                });
                filtered = hip_4.filter(function (item) { return item.to === id_3; });
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(firestore, 'users'))];
            case 2:
                users = _a.sent();
                usersdata = users.docs;
                usership_2 = [];
                usersdata.map(function (item) {
                    var obj = item.data();
                    usership_2.push(__assign({ id: item.id }, obj));
                });
                finaldata_1 = [];
                filtered.map(function (item) {
                    var _a, _b;
                    var single = {
                        id: item.id,
                        from: usership_2.filter(function (ite) { return ite.id === item.from; })[0].phone
                    };
                    finaldata_1.push(__assign(__assign({}, item), { from: ((_a = usership_2.filter(function (ite) { return ite.id === item.from; })[0]) === null || _a === void 0 ? void 0 : _a.phone) === null ? item.from : (_b = usership_2.filter(function (ite) { return ite.id === item.from; })[0]) === null || _b === void 0 ? void 0 : _b.phone }));
                });
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        transactions: finaldata_1,
                    })];
            case 3:
                error_8 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Server Error',
                        error: error_8
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/filter/user', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id_4, transactions, data, hip_5, filtered, users, usersdata, usership_3, finaldata_2, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id_4 = req.query.id;
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(firestore, 'transactions'))];
            case 1:
                transactions = _a.sent();
                data = transactions.docs;
                hip_5 = [];
                data.map(function (item) {
                    var obj = item.data();
                    hip_5.push(__assign({ id: item.id }, obj));
                });
                filtered = hip_5.filter(function (item) { return item.to === id_4; });
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(firestore, 'merchants'))];
            case 2:
                users = _a.sent();
                usersdata = users.docs;
                usership_3 = [];
                usersdata.map(function (item) {
                    var obj = item.data();
                    usership_3.push(__assign({ id: item.id }, obj));
                });
                finaldata_2 = [];
                filtered.map(function (item) {
                    var _a, _b;
                    var single = {
                        id: item.id,
                        from: usership_3.filter(function (ite) { return ite.id === item.to; })[0].phone
                    };
                    finaldata_2.push(__assign(__assign({}, item), { from: ((_a = usership_3.filter(function (ite) { return ite.id === item.to; })[0]) === null || _a === void 0 ? void 0 : _a.phone) === null ? item.to : (_b = usership_3.filter(function (ite) { return ite.id === item.to; })[0]) === null || _b === void 0 ? void 0 : _b.phone }));
                });
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        transactions: finaldata_2,
                    })];
            case 3:
                error_9 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Server Error',
                        error: error_9
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/leaderboard/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userRef, usersRef, users_1, transactionsRef, data, transactions_1, finalData_2, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(firestore, 'users'))];
            case 1:
                userRef = _a.sent();
                usersRef = userRef.docs;
                users_1 = [];
                usersRef.map(function (item) {
                    var obj = item.data();
                    users_1.push(__assign({ id: item.id }, obj));
                });
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(firestore, 'transactions'))];
            case 2:
                transactionsRef = _a.sent();
                data = transactionsRef.docs;
                transactions_1 = [];
                data.map(function (item) {
                    var obj = item.data();
                    transactions_1.push(__assign({ id: item.id }, obj));
                });
                finalData_2 = [];
                users_1.map(function (item) {
                    console.log(item.id);
                    var totalSpendings = transactions_1.filter(function (a) { return a.from === item.id; });
                    console.log(totalSpendings);
                    var totalSpending = 0;
                    totalSpendings.map(function (spends) {
                        console.log(spends);
                        totalSpending = +totalSpending + spends.amount;
                    });
                    var data = {
                        id: item.id,
                        identity: item.name === null ? item.phone : item.name,
                        name: item.name,
                        phone: item.phone,
                        balance: item.balance,
                        totalSpent: totalSpending
                    };
                    finalData_2.push(data);
                });
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        data: finalData_2
                    })];
            case 3:
                error_10 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Server Error',
                        error: error_10
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/referals/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id_5, dataall_1, transactions, data, hip_6, filtered, alldata, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id_5 = req.query.id;
                dataall_1 = [];
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(firestore, 'refferal'))];
            case 1:
                transactions = _a.sent();
                data = transactions.docs;
                hip_6 = [];
                data.map(function (item) {
                    var obj = item.data();
                    hip_6.push(__assign({ id: item.id }, obj));
                });
                filtered = hip_6.filter(function (item) { return item.refferedBy === id_5; });
                return [4 /*yield*/, filtered.map(function (item) { return __awaiter(void 0, void 0, void 0, function () {
                        var transactionsRef, querySnapshot, totalSpent, queryRef, userRef, usr, user;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    transactionsRef = (0, firestore_1.collection)(firestore, 'transactions');
                                    return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.query)(transactionsRef, (0, firestore_1.where)('from', '==', item.user)))];
                                case 1:
                                    querySnapshot = _a.sent();
                                    totalSpent = 0;
                                    querySnapshot.forEach(function (doc) {
                                        var transaction = doc.data();
                                        totalSpent += transaction.amount;
                                    });
                                    return [4 /*yield*/, (0, firestore_1.doc)(firestore, 'users', item.user)];
                                case 2:
                                    queryRef = _a.sent();
                                    return [4 /*yield*/, (0, firestore_1.getDoc)(queryRef)];
                                case 3:
                                    userRef = _a.sent();
                                    usr = userRef.data();
                                    user = dataall_1.push({
                                        name: usr.name,
                                        phone: usr.phone,
                                        totalSpent: totalSpent !== null && totalSpent !== void 0 ? totalSpent : 0,
                                    });
                                    console.log(usr);
                                    return [2 /*return*/, user];
                            }
                        });
                    }); })];
            case 2:
                alldata = _a.sent();
                console.log(dataall_1);
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        data: dataall_1,
                    })];
            case 3:
                error_11 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Server Error',
                        error: error_11
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/userdata/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id_6, transactions, data, hip_7, filtered, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id_6 = req.query.id;
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(firestore, 'users'))];
            case 1:
                transactions = _a.sent();
                data = transactions.docs;
                hip_7 = [];
                data.map(function (item) {
                    var obj = item.data();
                    hip_7.push(__assign({ id: item.id }, obj));
                });
                filtered = hip_7.filter(function (item) { return item.id === id_6; });
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        user: filtered[0],
                    })];
            case 2:
                error_12 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Server Error',
                        error: error_12
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/withdraw', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, amount, userId, withdrawRef, error_13;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, amount = _a.amount, userId = _a.userId;
                return [4 /*yield*/, (0, firestore_1.addDoc)((0, firestore_1.collection)(firestore, 'withdraw'), {
                        amount: amount,
                        userId: userId,
                        timestamp: Date.now(),
                        approved: false,
                    })];
            case 1:
                withdrawRef = _b.sent();
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        message: 'Withdrawal request submitted successfully',
                        withdrawId: withdrawRef.id,
                    })];
            case 2:
                error_13 = _b.sent();
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Server Error',
                        error: error_13
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/withdraw', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var withdrawRef, hip_8, data, users, usersdata, usership_4, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(firestore, 'withdraw'))];
            case 1:
                withdrawRef = _a.sent();
                hip_8 = [];
                data = withdrawRef.docs;
                return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(firestore, 'merchants'))];
            case 2:
                users = _a.sent();
                usersdata = users.docs;
                usership_4 = [];
                usersdata.map(function (item) {
                    var obj = item.data();
                    usership_4.push(__assign({ id: item.id }, obj));
                });
                console.log(usership_4);
                data.map(function (item) {
                    var _a, _b;
                    var a = item.data();
                    var newItem = {
                        id: item.id,
                        timestamp: a.timestamp,
                        approved: a.approved,
                        amount: a.amount,
                        userId: (_b = (_a = usership_4.filter(function (d) { return d.id == a.userId; })[0]) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'Merchant Deleted ' + a.userId
                    };
                    hip_8.push(newItem);
                });
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        withdraws: hip_8,
                    })];
            case 3:
                error_14 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Server Error',
                        error: error_14
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.put('/withdraw/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, withdrawRef, merchantRef, withdraw, merchantId, merchant, newBalance, error_15;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                id = req.params.id;
                withdrawRef = (0, firestore_1.collection)(firestore, 'withdraw');
                merchantRef = (0, firestore_1.collection)(firestore, 'merchants');
                return [4 /*yield*/, (0, firestore_1.updateDoc)((0, firestore_1.doc)(withdrawRef, id), {
                        approved: true
                    })];
            case 1:
                _d.sent();
                return [4 /*yield*/, (0, firestore_1.getDoc)((0, firestore_1.doc)(withdrawRef, id))];
            case 2:
                withdraw = _d.sent();
                merchantId = (_a = withdraw === null || withdraw === void 0 ? void 0 : withdraw.data()) === null || _a === void 0 ? void 0 : _a.userId;
                return [4 /*yield*/, (0, firestore_1.getDoc)((0, firestore_1.doc)(merchantRef, merchantId))];
            case 3:
                merchant = _d.sent();
                newBalance = ((_b = merchant.data()) === null || _b === void 0 ? void 0 : _b.balance) - ((_c = withdraw.data()) === null || _c === void 0 ? void 0 : _c.amount);
                return [4 /*yield*/, (0, firestore_1.updateDoc)((0, firestore_1.doc)(merchantRef, merchantId), {
                        balance: newBalance
                    })];
            case 4:
                _d.sent();
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        message: 'Withdrawal request updated successfully',
                    })];
            case 5:
                error_15 = _d.sent();
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Server Error',
                        error: error_15
                    })];
            case 6: return [2 /*return*/];
        }
    });
}); });

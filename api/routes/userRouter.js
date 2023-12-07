const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route để xác thực khách hàng
router.post('/login', userController.login);                        //
// {
//     "result": "0123456789" --> TEL
// }

// Route để lấy thông tin khách hàng
router.get('/user-info/:user_acc', userController.userInfor);       //
// {
//     "TEL": "0234567890",
//     "PASS": "Random_Password_2",
//     "NAME": "Mia Garcia",
//     "AVA": "U2.png",
//     "VIP": 0
// }

// Route để thêm khách hàng
router.post('/add-user', userController.userAdd);                   //  

// Route để cập nhật thông tin khách hàng
router.put('/user-info/update', userController.userInforUpdate);    //

module.exports = router;
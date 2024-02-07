const express = require('express');
const router = express.Router();
const { validateData, validateJWT } = require('../middlewares/authMiddleware');
const { signup, login, update, getUserInfos, getUsers } = require('../controller/userController');

router.post('/signup', validateData, signup);
router.post('/login', login);

router.put('/user/:id',validateJWT, update);
router.get('/user/:id', validateJWT, getUserInfos);
router.get('/users', validateJWT, getUsers)

module.exports = router;
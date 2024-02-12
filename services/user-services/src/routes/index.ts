// src/routes/customerRoutes.ts
import express from 'express';
import { getAllUser} from '../controller/testController';
import {createUser, getUser, updateUser} from '../controller/userController';
import {signUpHandler} from '../auth/cognito-signup';
import {loginHandler} from '../auth/cognito-login';
import {updateUserHandler} from '../auth/cognito-updateUser';
import {getUserHandler} from '../auth/cognito-getUser';

const router = express.Router();

router.get('/all', getAllUser);

router.post('/create', createUser);
router.get('/get', getUser);
router.post('/update', updateUser);

// Cognito
router.post('/signup', signUpHandler);
router.post('/login', loginHandler);
router.put('/update', updateUserHandler);
router.get('/getUser', getUserHandler);

module.exports = router;
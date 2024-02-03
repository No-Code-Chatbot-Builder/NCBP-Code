// src/routes/customerRoutes.ts
import express from 'express';
import { getAllUser} from '../controller/testController';
import {createUser, getUser, updateUser} from '../controller/userController';
import {signUpHandler} from '../auth/cognito-signup';

const router = express.Router();

router.get('/all', getAllUser);

router.post('/create', createUser);
router.get('/get', getUser);
router.post('/update', updateUser);

// Cognito
router.post('/signup', signUpHandler);

module.exports = router;
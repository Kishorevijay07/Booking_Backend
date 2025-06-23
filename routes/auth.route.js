import express from 'express';
import { register,login,logout,getme} from '../controllers/auth.controller.js';
import protectroute from '../middleware/protectroute.js';
import { authenticate } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.post('/logout',logout);
router.get('/getme',authenticate, getme); // use auth middleware for protection

export default router;

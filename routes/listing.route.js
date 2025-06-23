import express from 'express';
import {createListing, getalllists, getParticularHotel}from '../controllers/list.controller.js';
import { authenticate } from '../middleware/authMiddleware.js';
const router = express.Router();    

router.post('/',authenticate,createListing);
router.get('/',getalllists)
router.get('/:id',getParticularHotel)
export default router;


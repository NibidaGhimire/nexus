import express from 'express';
import { createSubNexus, getSubNexus, getAllSubNexus, joinSubNexus } from '../controllers/subnexus.controller.js';
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post('/create', protectRoute, createSubNexus);
router.get('/:id', getSubNexus);
router.get("/", getAllSubNexus);
router.post('/:id/join', protectRoute, joinSubNexus);

export default router;
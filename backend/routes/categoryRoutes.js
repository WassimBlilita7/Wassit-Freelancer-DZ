import express from 'express';
import {protect} from '../middleware/authMiddleware.js';
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from '../controllers/categoryController.js';

const router = express.Router();

router.post("/" , createCategory);
router.get("/" , getAllCategories);
router.get("/:id" , getCategoryById);
router.put("/:id", protect, updateCategory);
router.delete("/:id", protect, deleteCategory);
export default router;
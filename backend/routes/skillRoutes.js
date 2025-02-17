import express from "express";
import {protect} from "../middleware/authMiddleware.js"
import { createSkill, deleteSkill, getAllSkills, getSkillById, updateSkill } from "../controllers/skillController.js";

const router = express.Router();

router.post("/" , protect,createSkill);
router.get("/" , protect,getAllSkills);
router.get("/:id", getSkillById);
router.put("/:id", protect, updateSkill);
router.delete("/:id", protect, deleteSkill);

export default router;
import express from "express";
import {viewAssignments, answerQuestionSubmit, viewAnAssignment} from '../controllers/student.controllers.js';
const router = express.Router();

router.get("/viewassignments", viewAssignments);
router.get("/viewassignment/:assignmentId", viewAnAssignment);
router.post("/answerassignment/:assignmentId/:questionId", answerQuestionSubmit);

export default router;
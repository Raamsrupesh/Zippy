import express from "express";
import {insertingDoc, viewAssignments, answerQuestionSubmit, viewAnAssignment, viewThePrecisedResults, viewOverallMarks} from '../controllers/student.controllers.js';
const router = express.Router();

router.post("/create", insertingDoc);
router.get("/viewassignments", viewAssignments);
router.get("/viewassignment/:assignmentId", viewAnAssignment);
router.post("/answerassignment/:assignmentId/:questionId", answerQuestionSubmit);
router.get("/assignment/:assignmentId/results", viewThePrecisedResults);
router.get("/assignment/:assignmentId/marks", viewOverallMarks);

export default router;
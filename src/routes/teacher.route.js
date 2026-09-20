import { creatingAssignment, fetchAnAssignment, deletingAnAssignment, updatingAnAssignment, postingQuestions, fetchAquestion, updateAQuestionText, updateAQuestionMarks, updateAMarkingScheme, updateACompleteQuestion, deleteAQuestion, viewAllStudentsAnswers, compareAllQuestionsAndAnswersOfStudent, compareAllQAndAsWithEvaluationsOfStudent, approveTheAssignmentForThisStudent, updateTheMarksForThisStudent, insertingDoc } from "../controllers/teacher.controllers.js";
import express from "express";
const router = express.Router();

router.post("/create", insertingDoc)
router.post("/createAssignment", creatingAssignment);
router.get("/assignment/:assignmentId", fetchAnAssignment);
router.delete("/assignment/:assignmentId", deletingAnAssignment);
router.put("/assignment/:assignmentId", updatingAnAssignment);
router.post("/assignment/:assignmentId/postQuestion", postingQuestions);
router.post("/:questionId", fetchAquestion);
router.patch("/questiontext/:questionId", updateAQuestionText);
router.patch("/questionmarks/:questionId", updateAQuestionMarks);
router.patch("/questionMS/:questionId", updateAMarkingScheme);
router.patch("/question/:questionId", updateACompleteQuestion);
router.delete("/:questionId", deleteAQuestion);
router.get("/assignment/answers/:assignmentId", viewAllStudentsAnswers);
router.get("/assignment/compareQAs/:submissionId", compareAllQuestionsAndAnswersOfStudent);
router.get("/assignment/compareQAswithEval/:submissionId", compareAllQAndAsWithEvaluationsOfStudent);

export default router;
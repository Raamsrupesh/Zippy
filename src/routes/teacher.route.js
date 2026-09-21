import { creatingAssignment, fetchAnAssignment, deletingAnAssignment, updatingAnAssignment, postingQuestions, fetchAquestion, updateAQuestionText, updateAQuestionMarks, updateAMarkingScheme, updateACompleteQuestion, deleteAQuestion, viewAllStudentsAnswers, compareAllQuestionsAndAnswersOfStudent, compareAllQAndAsWithEvaluationsOfStudent, approveTheAssignmentForThisStudent, updateTheMarksForThisStudent, makeTheAssignmentLive, closeTheAssignment, insertingDoc, analyaticsOfAssignment, resultsOfAStudentOfAssignment } from "../controllers/teacher.controllers.js";
import { evaluatingAndGiveFeedbackDemo, InsertingTotalMarksByCalculating } from "../controllers/mockEval.controllers.js";
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
router.post("/submission-answer/:submissionAnswerId/evaluate", evaluatingAndGiveFeedbackDemo);
router.post("/submission/:submissionId/calculate-marks", InsertingTotalMarksByCalculating);
router.patch("/assignment/:assignmentId/live", makeTheAssignmentLive);
router.patch("/assignment/:assignmentId/close", closeTheAssignment);
router.patch("/assignment/:assignmentId/student/:studentId/approve", approveTheAssignmentForThisStudent);
router.patch("/assignment/:assignmentId/student/:studentId/marks", updateTheMarksForThisStudent);
router.get("/assignment/:assignmentId/analytics", analyaticsOfAssignment);
router.get("/assignment/:assignmentId/:studentId", resultsOfAStudentOfAssignment);

export default router;
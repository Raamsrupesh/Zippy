import { Assignment } from "../models/assignment.model.js";
import {Question} from '../models/questions.model.js';
import {Submission} from '../models/submission.model.js';
import {Evaluation} from '../models/evaluation.model.js';
import {SubmissionAnswer} from '../models/submissionanswer.model.js'
import {EvaluationQuestion} from '../models/evaluationquestion.model.js';
import {isTeacherAuthorizedForThisBatch} from '../utils/teacherBatchAuth.utils.js'
import { Teacher } from "../models/teachers.model.js";
import { log } from "node:console";

export async function insertingDoc(req, res, next) {
    try {
        const {name, email, password, department, batchNo} = req.body;
        await Teacher.insertOne({name, email, password, department, batchNo});
        return res.status(201).json({msg : "Inserted the teacher doc!!"});
    } catch (error) {
        error.functionName = "insertingDoc";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

export async function creatingAssignment(req, res, next) {
    try {
        const teacherId = req.get("teacherId");
        if(!teacherId) return res.status(400).json({msg : "No teacherId present."});
        const {title, description, totalMarks, batchNo} = req.body;
        // Validations

        if(await isTeacherAuthorizedForThisBatch(teacherId, batchNo)){
            await Assignment.insertOne({title, description, totalMarks, teacherId, batchNo});
            return res.status(201).json({msg : "Created assignment successfully!!"});
        }
        return res.status(400).json({msg :"You aren't allocated to this batch..."});
    } catch (error) {
        error.functionName = "creatingAssignment";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

export async function fetchAnAssignment(req, res, next) {
    try {
        const teacherId = req.get("teacherId");
        const {assignmentId} = req.params;
        const assignmentDet = await Assignment.findById(assignmentId);
        if(!assignmentDet) return res.status(404).json({msg : "Assignment not found."});
        return res.status(200).json({data : assignmentDet});
    } catch (error) {
        error.functionName = "fetchAnAssignment";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

export async function deletingAnAssignment(req, res, next) {
    try {
        const teacherId = req.get("teacherId");
        const {assignmentId} = req.params;
        const assignmentDet = await Assignment.findByIdAndDelete(assignmentId);
        if(!assignmentDet) return res.status(404).json({msg : "Assignment not found."});
        return res.status(200).json({msg : "Successfully deleted!!"});
    } catch (error) {
        error.functionName = "deletingAnAssignment";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

export async function updatingAnAssignment(req, res, next) {
    try {

        const teacherId = req.get("teacherId");
        const {assignmentId} = req.params;
        const {title, description, totalMarks} = req.body;
        const assignmentDet = await Assignment.findByIdAndUpdate(assignmentId, {title, description, totalMarks, teacherId}, {new:true});
        if(!assignmentDet) return res.status(404).json({msg : "Assignment not found."});
        return res.status(200).json({data : assignmentDet});

    } catch (error) {
        error.functionName = "updatingAnAssignment";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

export async function postingQuestions(req, res, next) {
    try {
        const teacherId = req.get("teacherId");
        const {assignmentId} = req.params;
        const {questionsDetails} = req.body;
        const assignmentDet = await Assignment.findById(assignmentId);
        if(!assignmentDet) return res.status(404).json({msg : "Assignment not found."});
        await Promise.all(questionsDetails.map((questionDetails) =>
            Question.insertOne({assignmentId, ...questionDetails})
        ));
        return res.status(201).json({msg : "Inserted all the questions in the database."});

    } catch (error) {
        error.functionName = "postingQuestions";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

export async function fetchAquestion(req, res, next) {
    try {
        const {questionId} = req.params;
        const question = await Question.findById(questionId);
        if(!question) return res.status(404).json({msg : "Question not found."});
        return res.status(200).json({data : question});
    } catch (error) {
        error.functionName = "fetchAquestion";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }    
}

export async function updateAQuestionText(req, res, next) {
    try {
        const {questionId} = req.params;
        const {questionText} = req.body;
        const question = await Question.findByIdAndUpdate(questionId, {questionText}, {new:true});
        if(!question) return res.status(404).json({msg : "Question not found."});
        return res.status(200).json({data : question});
    } catch (error) {
        error.functionName = "updateAQuestionText";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

export async function updateAQuestionMarks(req, res, next) {
    try {
        const {questionId} = req.params;
        const {maxMarks} = req.body;
        const question = await Question.findByIdAndUpdate(questionId, {maxMarks}, {new:true});
        if(!question) return res.status(404).json({msg : "Question not found."});
        return res.status(200).json({data : question});
    } catch (error) {
        error.functionName = "updateAQuestionMarks";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

export async function updateAMarkingScheme(req, res, next) {
    try {
        const {questionId} = req.params;
        const {markingScheme} = req.body;
        const question = await Question.findByIdAndUpdate(questionId, {markingScheme}, {new:true});
        if(!question) return res.status(404).json({msg : "Question not found."});
        return res.status(200).json({data : question});
    } catch (error) {
        error.functionName = "updateAMarkingScheme";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

export async function updateACompleteQuestion(req, res, next) {
    try {
        const {questionId} = req.params;
        const {markingScheme, maxMarks, questionText} = req.body;
        const question = await Question.findByIdAndUpdate(questionId, {markingScheme, maxMarks, questionText}, {new:true});
        if(!question) return res.status(404).json({msg : "Question not found."});
        return res.status(200).json({data : question});
    } catch (error) {
        error.functionName = "updateACompleteQuestion";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

export async function deleteAQuestion(req, res, next) {
    try {
        const {questionId} = req.params;
        const question = await Question.findByIdAndDelete(questionId);
        if(!question) return res.status(404).json({msg : "Question not found."});
        return res.status(200).json({msg : "Successfully deleted!!"});
    } catch (error) {
        error.functionName = "deleteAQuestion";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

export async function viewAllStudentsAnswers(req, res, next) {
    try {
        const teacherId = req.get("teacherId");
        const {assignmentId} = req.params;

        const assignmentDet = await Assignment.findById(assignmentId);
        if(!assignmentDet) return res.status(404).json({msg : "Assignment not found."});
        const submissions = await Submission.find({assignmentId}).select("_id");
        const studentSubs = await SubmissionAnswer.find({submissionId: {$in: submissions.map(({_id}) => _id)}});
                
        return res.status(200).json({data:[{assignmentDet}, {studentSubs}]});

    } catch (error) {
        error.functionName = "viewAllStudentsAnswers";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

export async function compareAllQuestionsAndAnswersOfStudent(req, res, next){
    try {
        const {submissionId} = req.params;
        const submission = await Submission.findById(submissionId);
        if(!submission) return res.status(404).json({msg : "Submission not found."});
        const allQuestions = await Question.find({assignmentId: submission.assignmentId});
        const submittedAnswers = await SubmissionAnswer.find({submissionId});

        const questionAnswersArray = allQuestions.map((question, index) => ({
            question,
            answer: submittedAnswers[index]
        }));

        return res.status(200).json({questionAnswersArray});
    } catch (error) {
        error.functionName = "compareAllQuestionsAndAnswersOfStudent";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

export async function compareAllQAndAsWithEvaluationsOfStudent(req, res, next) {
    try {
        const {submissionId} = req.params;
        const submission = await Submission.findById(submissionId);
        if(!submission) return res.status(404).json({msg : "Submission not found."});
        const allQuestions = await Question.find({assignmentId: submission.assignmentId});
        const submittedAnswers = await SubmissionAnswer.find({submissionId});
        const evaluatedQuestions = await EvaluationQuestion.find({submissionId});
        
        const questionAnswersArray = allQuestions.map((question, index) => ({
            question,
            answer: submittedAnswers[index],
            evaluation: evaluatedQuestions[index]
        }));
        
        return res.status(200).json({questionAnswersArray});
    } catch (error) {
        error.functionName = "compareAllQAndAsWithEvaluationsOfStudent";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

export async function approveTheAssignmentForThisStudent(req, res, next) {
    try {
        const teacherId = req.get("teacherId");
        const {studentId} = req.params;
        const {assignmentId} = req.params;
        
        await Evaluation.findOneAndUpdate({studentId, assignmentId}, {status:"APPROVED"});
        return res.status(200).json({msg : "Successfully updated the evaluations!!"});
        
    } catch (error) {
        error.functionName = "approveTheAssignmentForThisStudent";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);        
    }
}

export async function updateTheMarksForThisStudent(req, res, next) {
    try {
        const teacherId = req.get("teacherId");
        const {studentId} = req.params;
        const {assignmentId} = req.params;
        
        const {mockMarks, mockFeedback} = req.body;
        if(mockFeedback !== "") await Evaluations.findOneAndUpdate({studentId, assignmentId}, {mockMarks, mockFeedback, status:"APPROVED"});
        else await Evaluation.findOneAndUpdate({studentId, assignmentId}, {mockMarks, status:"APPROVED"});
        return res.status(200).json({msg : "Successfully updated the evaluations!!"});
        
    } catch (error) {
        error.functionName = "updateTheMarksForThisStudent";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

export async function makeTheAssignmentLive(req, res, next) {
    try {
        const teacherId = req.get("teacherId"); 
        const {assignmentId} = req.params;

        const assignmentDet = await Assignment.findById(assignmentId);
        const teacherDet = await Teacher.findById(teacherId);
        if(teacherDet.batchNo.includes(assignmentDet.batchNo)){
            assignmentDet.status = "LIVE";
            await assignmentDet.save();

            return res.status(200).json({msg : "Successfully made this assignment live!"});
        }
        return res.status(403).json({msg : "Sorry, You aren't authorized to make this assignment live!"});

    } catch (error) {
        error.functionName = "makeTheAssignmentLive";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

export async function closeTheAssignment(req, res, next) {
    try {
        const teacherId = req.get("teacherId"); 
        const {assignmentId} = req.params;

        const assignmentDet = await Assignment.findById(assignmentId);
        const teacherDet = await Teacher.findById(teacherId);
        if(teacherDet.batchNo.includes(assignmentDet.batchNo)){
            assignmentDet.status = "CLOSED";
            await assignmentDet.save();

            return res.status(200).json({msg : "Successfully closed this assignment!"});
        }
        return res.status(403).json({msg : "Sorry, You aren't authorized to close this assignment!"});

    } catch (error) {
        error.functionName = "closeTheAssignment";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}
import {Student} from '../models/student.model.js'
import {Assignment} from '../models/assignment.model.js'
import { SubmissionAnswer } from '../models/submissionanswer.model.js';
import {Submission} from '../models/submission.model.js';

export async function viewAssignments(req, res, next) {
    try {
        const {studentId} = req;
        const studentDet = await Student.findById(studentId);
        if(!studentDet) return res.status(404).json({msg : "Student not found."});
        if(studentDet.batchNo){
            const assignmentDet = await Assignment.find({batchNo:studentDet.batchNo, status:"LIVE"}).sort({createdAt:-1});
            return res.status(200).json({data : assignmentDet});
        }
        return res.status(404).json({msg : "Student didn't enroll in any course yet!"});
    } catch (error) {
        error.functionName = "viewAssignments";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

export async function viewAnAssignment(req, res, next) {
    try {
        const {studentId} = req;
        const {assignmentId} = req.params;
        const studentDet = await Student.findById(studentId);
        if(!studentDet) return res.status(404).json({msg : "Student not found."});
        if(studentDet.batchNo){
            const assignmentDet = await Assignment.findById(assignmentId);
            if(!assignmentDet) return res.status(404).json({msg : "Assignment not found."});
            if(assignmentDet.batchNo === studentDet.batchNo) return res.status(200).json({data : assignmentDet});
            return res.status(400).json({msg : "Sorry, you aren't enrolled in this batch."});
        }
        return res.status(404).json({msg : "Student didn't enroll in any course yet!"});
    } catch (error) {
        error.functionName = "viewAnAssignment";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

export async function answerQuestionSubmit(req, res, next) {
    try {
        const {studentId} = req;
        const {assignmentId} = req.params;
        const {questionId} = req.params;
        const {answerText} = req.body;

        const studentDet = await Student.findById(studentId);
        const assignmentDet = await Assignment.findById(assignmentId);
        if(!studentDet) return res.status(404).json({msg : "Student not found."});
        if(!assignmentDet) return res.status(404).json({msg : "Assignment not found."});
        if(assignmentDet.status !== "LIVE"){
            return res.status(409).json({msg : "The assignment is not live currently."});
        }
        if(studentDet.batchNo === assignmentDet.batchNo){
                const submissionDet = await Submission.insertOne({studentId, assignmentId});
                await SubmissionAnswer.insertOne({submissionId:submissionDet._id, questionId, answerText});

                return res.status(201).json({msg : `Successfully inserted the answer of question : ${questionId}.`});
        }
        return res.status(403).json({msg : "Sorry, you're not enrolled in this batch!"});

    } catch (error) {
        error.functionName = "answerQuestionSubmit";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}


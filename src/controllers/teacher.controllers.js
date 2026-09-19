import { Assignment } from "../models/assignment.model.js";
import {Questions} from '../models/questions.model.js';
import {Submissions} from '../models/submission.model.js'
import {Evaluations} from '../models/evaluation.model.js'
export async function creatingAssignment(req, res, next) {
    try {
        const {teacherId} = req;
        const {title, description, totalMarks} = req.body;
        await Assignment.insertOne({title, description, totalMarks, teacherId});
        return res.status(201).json({msg : "Created assignment successfully!!"});
    } catch (error) {
        error.functionName = "creatingAssignment";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

export async function postingQuestions(req, res, next) {
    try {
        const {teacherId} = req;
        const {assignmentId} = req.params;
        const {questionsDetails} = req.body;
        questionsDetails.forEach(async (questionDetails) => {
            await Questions.insertOne(
                {assignmentId, ...questionDetails}
            )
        });
        return res.status(201).json({msg : "Inserted all the questions in the database."});

    } catch (error) {
        error.functionName = "postingQuestions";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

/*
export async function viewStudentsAnswers(req, res, next) {
    try {
        const {teacherId} = req;
        const {assignmentId} = req.params;

        const assignment_det = await Assignment.findById(assignmentId);
        const student_subs = await Submissions.findOne({assignmentId});
        const questions = await Questions.findOne({assignmentId});
        const evaluationMarks = await Evaluations.findOne({submissionId:student_subs._id});
        const eachArray = [];
        for (let index = 0; index < student_subs.length; index++) {
            eachArray.push({`Question ${index}`: questions[index],`${index}`:student_subs.answers[index]}); 
        }
        return res.status(200).json({data:[{assignment_det}, {studentId:student_subs.studentId}, {comparisionTable:eachArray}, {evaluationMarks}]})

    } catch (error) {
        error.functionName = "viewStudentsAnswers";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}
*/

export async function approveTheAssignmentForThisStudent(req, res, next) {
    try {
        const {teacherId} = req;
        const {studentId} = req.params;
        const {assignmentId} = req.params;
        
        await Evaluations.findOneAndUpdate({studentId, assignmentId}, {status:"APPROVED"});
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
        const {teacherId} = req;
        const {studentId} = req.params;
        const {assignmentId} = req.params;
        
        const {mockMarks, mockFeedback} = req.body;
        if(mockFeedback !== "") await Evaluations.findOneAndUpdate({studentId, assignmentId}, {mockMarks, mockFeedback, status:"APPROVED"});
        else await Evaluations.findOneAndUpdate({studentId, assignmentId}, {mockMarks, status:"APPROVED"});
        return res.status(200).json({msg : "Successfully updated the evaluations!!"});
        
    } catch (error) {
        error.functionName = "updateTheMarksForThisStudent";
        error.statusCode = 500;
        error.msg = "Somethin went wrong."
        return next(error);
    }
}
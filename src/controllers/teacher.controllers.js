import { Assignment } from "../models/assignment.model.js";
import {Question} from '../models/questions.model.js';
import {Submission} from '../models/submission.model.js';
import {Evaluation} from '../models/evaluation.model.js';
import {SubmissionAnswer} from '../models/submissionanswer.model.js'
import {EvaluationQuestion} from '../models/evaluationquestion.model.js';
import {isTeacherAuthorizedForThisBatch} from '../utils/teacherBatchAuth.utils.js'
import {teacherInsertionValidations} from '../validations/teacher.validations.js'
import {assignmentInsertionValidations} from '../validations/assignment.validations.js'
import { Teacher } from "../models/teachers.model.js";
import {Student} from '../models/student.model.js';

async function findTeacherOwnedQuestion(questionId, teacherId) {
    const question = await Question.findById(questionId).select("+assignmentId");
    if(!question) return {question:null, assignment:null};
    const assignment = await Assignment.findOne({_id:question.assignmentId, teacherId}).select("+teacherId");
    return {question, assignment};
}

export async function insertingDoc(req, res, next) {
    try {
        const {data, error} = await teacherInsertionValidations.safeParse(req.body);
        if(error) return res.status(400).json({msg : error.issues[0].message})
        await Teacher.create(data);
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
        
        const{data, error} = assignmentInsertionValidations.safeParse(req.body);
        if(error) return res.status(400).json({msg : error.issues[0].message});

        if(await isTeacherAuthorizedForThisBatch(teacherId, data.batchNo)){
            await Assignment.insertOne({...data, teacherId});
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
        const assignmentDet = await Assignment.findById(assignmentId).select("+teacherId");
        if(!assignmentDet) return res.status(404).json({msg : "Assignment not found."});
        if(String(assignmentDet.teacherId) !== String(teacherId)) return res.status(403).json({msg : "You aren't authorized for this assignment."});
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
        const assignmentDet = await Assignment.findById(assignmentId).select("+teacherId");
        if(!assignmentDet) return res.status(404).json({msg : "Assignment not found."});
        if(String(assignmentDet.teacherId) !== String(teacherId)) return res.status(403).json({msg : "You aren't authorized for this assignment."});
        await assignmentDet.deleteOne();
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
        const existingAssignment = await Assignment.findById(assignmentId).select("+teacherId");
        if(!existingAssignment) return res.status(404).json({msg : "Assignment not found."});
        if(String(existingAssignment.teacherId) !== String(teacherId)) return res.status(403).json({msg : "You aren't authorized for this assignment."});
        const assignmentDet = await Assignment.findByIdAndUpdate(assignmentId, {title, description, totalMarks}, {new:true, runValidators:true});
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
        const assignmentDet = await Assignment.findById(assignmentId).select("+teacherId");
        if(!assignmentDet) return res.status(404).json({msg : "Assignment not found."});
        if(String(assignmentDet.teacherId) !== String(teacherId)) return res.status(403).json({msg : "You aren't authorized for this assignment."});
        if(!Array.isArray(questionsDetails) || questionsDetails.length === 0) return res.status(400).json({msg : "questionsDetails must be a non-empty array."});
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
        const teacherId = req.get("teacherId");
        const {questionId} = req.params;
        const {question, assignment} = await findTeacherOwnedQuestion(questionId, teacherId);
        if(!question) return res.status(404).json({msg : "Question not found."});
        if(!assignment) return res.status(403).json({msg : "You aren't authorized for this question."});
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
        const teacherId = req.get("teacherId");
        const {questionId} = req.params;
        const {questionText} = req.body;
        const {question, assignment} = await findTeacherOwnedQuestion(questionId, teacherId);
        if(!question) return res.status(404).json({msg : "Question not found."});
        if(!assignment) return res.status(403).json({msg : "You aren't authorized for this question."});
        question.questionText = questionText;
        await question.save();
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
        const teacherId = req.get("teacherId");
        const {questionId} = req.params;
        const {maxMarks} = req.body;
        const {question, assignment} = await findTeacherOwnedQuestion(questionId, teacherId);
        if(!question) return res.status(404).json({msg : "Question not found."});
        if(!assignment) return res.status(403).json({msg : "You aren't authorized for this question."});
        question.maxMarks = maxMarks;
        await question.save();
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
        const teacherId = req.get("teacherId");
        const {questionId} = req.params;
        const {markingScheme} = req.body;
        const {question, assignment} = await findTeacherOwnedQuestion(questionId, teacherId);
        if(!question) return res.status(404).json({msg : "Question not found."});
        if(!assignment) return res.status(403).json({msg : "You aren't authorized for this question."});
        question.markingScheme = markingScheme;
        await question.save();
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
        const teacherId = req.get("teacherId");
        const {questionId} = req.params;
        const {markingScheme, maxMarks, questionText} = req.body;
        const {question, assignment} = await findTeacherOwnedQuestion(questionId, teacherId);
        if(!question) return res.status(404).json({msg : "Question not found."});
        if(!assignment) return res.status(403).json({msg : "You aren't authorized for this question."});
        question.markingScheme = markingScheme;
        question.maxMarks = maxMarks;
        question.questionText = questionText;
        await question.save();
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
        const teacherId = req.get("teacherId");
        const {questionId} = req.params;
        const {question, assignment} = await findTeacherOwnedQuestion(questionId, teacherId);
        if(!question) return res.status(404).json({msg : "Question not found."});
        if(!assignment) return res.status(403).json({msg : "You aren't authorized for this question."});
        await question.deleteOne();
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

        const assignmentDet = await Assignment.findById(assignmentId).select("+teacherId");
        if(!assignmentDet) return res.status(404).json({msg : "Assignment not found."});
        if(String(assignmentDet.teacherId) !== String(teacherId)) return res.status(403).json({msg : "You aren't authorized for this assignment."});
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
        const teacherId = req.get("teacherId");
        const {submissionId} = req.params;
        const submission = await Submission.findById(submissionId);
        if(!submission) return res.status(404).json({msg : "Submission not found."});
        const assignment = await Assignment.findOne({_id:submission.assignmentId, teacherId});
        if(!assignment) return res.status(403).json({msg : "You aren't authorized for this submission."});
        const allQuestions = await Question.find({assignmentId: submission.assignmentId});
        const submittedAnswers = await SubmissionAnswer.find({submissionId});

        const questionAnswersArray = allQuestions.map((question) => ({
            question,
            answer: submittedAnswers.find((answer) => String(answer.questionId) === String(question._id))
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
        const teacherId = req.get("teacherId");
        const {submissionId} = req.params;
        const submission = await Submission.findById(submissionId);
        if(!submission) return res.status(404).json({msg : "Submission not found."});
        const assignment = await Assignment.findOne({_id:submission.assignmentId, teacherId});
        if(!assignment) return res.status(403).json({msg : "You aren't authorized for this submission."});
        const allQuestions = await Question.find({assignmentId: submission.assignmentId});
        const submittedAnswers = await SubmissionAnswer.find({submissionId});
        const evaluatedQuestions = await EvaluationQuestion.find({submissionId});
        
        const questionAnswersArray = allQuestions.map((question) => ({
            question,
            answer: submittedAnswers.find((answer) => String(answer.questionId) === String(question._id)),
            evaluation: evaluatedQuestions.find((evaluation) => String(evaluation.questionId) === String(question._id))
        }));
        
        return res.status(200).json({data: questionAnswersArray});
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
        const assignment = await Assignment.findOne({_id:assignmentId, teacherId}).select("+teacherId");
        if(!assignment) return res.status(403).json({msg : "You aren't authorized for this assignment."});
        const submission = await Submission.findOne({studentId, assignmentId});
        if(!submission) return res.status(404).json({msg : "Submission not found."});
        const evaluation = await Evaluation.findOneAndUpdate({submissionId:submission._id}, {status:"APPROVED"}, {new:true});
        if(!evaluation) return res.status(404).json({msg : "Evaluation not found."});
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
        const assignment = await Assignment.findOne({_id:assignmentId, teacherId}).select("+teacherId");
        if(!assignment) return res.status(403).json({msg : "You aren't authorized for this assignment."});
        const {mockMarks, mockFeedback} = req.body;
        const submission = await Submission.findOne({studentId, assignmentId});
        if(!submission) return res.status(404).json({msg : "Submission not found."});
        const update = mockFeedback !== undefined && mockFeedback !== ""
            ? {mockMarks, mockFeedback, status:"APPROVED"}
            : {mockMarks, status:"APPROVED"};
        const evaluation = await Evaluation.findOneAndUpdate({submissionId:submission._id}, update, {new:true, runValidators:true});
        if(!evaluation) return res.status(404).json({msg : "Evaluation not found."});
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

        const assignmentDet = await Assignment.findById(assignmentId).select("+teacherId");
        const teacherDet = await Teacher.findById(teacherId);
        if(!assignmentDet) return res.status(404).json({msg : "Assignment not found."});
        if(!teacherDet) return res.status(404).json({msg : "Teacher not found."});
        if(String(assignmentDet.teacherId) === String(teacherId)){
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

        const assignmentDet = await Assignment.findById(assignmentId).select("+teacherId");
        const teacherDet = await Teacher.findById(teacherId);
        if(!assignmentDet) return res.status(404).json({msg : "Assignment not found."});
        if(!teacherDet) return res.status(404).json({msg : "Teacher not found."});
        if(String(assignmentDet.teacherId) === String(teacherId)){
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

export async function analyaticsOfAssignment(req, res, next) {
    try {
        const {assignmentId} = req.params;
        if(!assignmentId) return res.status(403).json({msg : "You aren't authorized for this assignment."});
        const assignmentDet = await Assignment.findById(assignmentId);
        if(!assignmentDet) return res.status(404).json({msg : "Assignment not found."});
        const submissionDet = await Submission.find({assignmentId});
        const studentCount = (await Student.find({batchNo: assignmentDet.batchNo})).length;
        const evaluations = (await Promise.all(
            submissionDet.map((submission) => Evaluation.findOne({submissionId:submission._id}))
        )).filter(Boolean);
        const marks = evaluations.map(({mockMarks}) => mockMarks);
        const sumOfMarks = marks.reduce((sum, mark) => sum + mark, 0);
        const evaluationCount = evaluations.length;
        const passCount = marks.filter((mark) => mark >= assignmentDet.passMarks).length;
        const avgMarks = evaluationCount ? sumOfMarks / evaluationCount : 0;
        return res.status(200).json({
            data:{
                studentCount,
                evaluationCount,
                avgMarks,
                highestMarks: evaluationCount ? Math.max(...marks) : null,
                lowestMarks: evaluationCount ? Math.min(...marks) : null,
                passCount,
                failCount:evaluationCount-passCount
            }
        });


    } catch (error) {
        error.functionName = "analyaticsOfAssignment";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

export async function resultsOfAStudentOfAssignment(req, res, next) {
    try {
        const teacherId = req.get("teacherId");
        const {studentId} = req.params;
        const {assignmentId} = req.params;
        const submission = await Submission.findOne({studentId, assignmentId});
        if(!submission) return res.status(404).json({msg : "Submission not found."});
        const assignment = await Assignment.findOne({_id:assignmentId, teacherId});
        if(!assignment) return res.status(403).json({msg : "You aren't authorized for this assignment."});

        const allQuestions = await Question.find({assignmentId: submission.assignmentId});
        const submittedAnswers = await SubmissionAnswer.find({submissionId:submission._id});
        const evaluatedQuestions = await EvaluationQuestion.find({submissionId:submission._id});
        const questionAnswersArray = allQuestions.map((question) => ({
            question,
            answer: submittedAnswers.find((answer) => String(answer.questionId) === String(question._id)),
            evaluation: evaluatedQuestions.find((evaluation) => String(evaluation.questionId) === String(question._id))
        }));
        
        return res.status(200).json({data: questionAnswersArray});

    } catch (error) {
        error.functionName = "resultsOfAStudentOfAssignment";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

export async function statusOfAssignments(req, res, next) {
    try {
        const {status} = req.query;
        if(status !== "PENDING" && status !== "LIVE" && status !== "CLOSED") return res.status(400).json({msg : "Invalid Input."});
        const assignmentDet = await Assignment.find({status});
        return res.status(200).json({data : assignmentDet});
    } catch (error) {
        error.functionName = "liveAssignments";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

export async function fetchStudentWithMarksGreaterThan(req, res, next){
    try {
        const {minMarks} = req.query;
        const {assignmentId} = req.params;
        const minimumMarks = Number(minMarks);
        if(minMarks === undefined || !Number.isFinite(minimumMarks)) return res.status(400).json({msg : "Minimum marks must be a number."});

        const evaluations = await Evaluation.find({assignmentId, mockMarks:{$gt: minimumMarks}});
        const evaluationArr = await Promise.all(evaluations.map(async (evaluation) => {
            const submissionDet = await Submission.findById(evaluation.submissionId);
            if(!submissionDet) return null;
            const studentDet = await Student.findById(submissionDet.studentId);
            return {studentDet, evaluation};
        }));
        return res.status(200).json({data : evaluationArr.filter(Boolean)});

    } catch (error) {
        error.functionName = "fetchStudentWithMarksGreaterThan";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

export async function sortEvaluationsBasedOnMarks(req, res, next){
    try {
        const {marks} = req.query;
        const {assignmentId} = req.params;
        const sortOrder = marks === "asc" ? 1 : marks === "desc" ? -1 : Number(marks);
        if(![1, -1].includes(sortOrder)) return res.status(400).json({msg : "Sort must be asc, desc, 1, or -1."});

        const evaluations = await Evaluation.find({assignmentId}).sort({mockMarks:sortOrder});
        const evaluationArr = await Promise.all(evaluations.map(async (evaluation) => {
            const submissionDet = await Submission.findById(evaluation.submissionId);
            if(!submissionDet) return null;
            const studentDet = await Student.findById(submissionDet.studentId);
            return {studentDet, evaluation};
        }));
        return res.status(200).json({data : evaluationArr.filter(Boolean)});
    } catch (error) {
        error.functionName = "sortEvaluationsBasedOnMarks";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}
    
export async function fetchResultsRollNowise(req, res, next) {
    try {
        const {assignmentId} = req.params;
        const submissionDet = await Submission.find({assignmentId}).sort({studentId:1});
        const results = await Promise.all(submissionDet.map((submission) =>
            Evaluation.findOne({submissionId:submission._id})
        ));
        return res.status(200).json({data : results});
    } catch (error) {
        error.functionName = "fetchResultsRollNowise";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }

}

/**
 * ?status=APPROVED
    ?minMarks=70
    ?sort=marks
    
 */
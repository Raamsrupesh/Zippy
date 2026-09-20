import {Evaluation} from '../models/evaluation.model.js'
import {EvaluationQuestion} from '../models/evaluationquestion.model.js'
import { SubmissionAnswer } from '../models/submissionanswer.model.js';
import { Submission } from '../models/submission.model.js';
import {Question} from '../models/questions.model.js';
import { Assignment } from '../models/assignment.model.js';
import {Student} from '../models/student.model.js';
import { giveMockFeed, AICorrectionService} from '../services/AIService.services.js';

/**
 * Actually, This controller should be implemented with AI but since the time 
 * given is less (1 day), I'm just using inbuilt functions and showing demo how actually
 * works for the time being..
 */
export async function evaluatingAndGiveFeedbackDemo(req, res, next) {
    try {
        const {submissionAnswerId} = req.params;

        // const assignmentDet = await Assignment.findById(assignmentId);
        const submissionAnswerDet = await SubmissionAnswer.findById(submissionAnswerId);
        const submissionDet = await Submission.findById(submissionAnswerDet.submissionId)
        const questionDet = await Question.findById(submissionAnswerDet.questionId);
        
        // The below is the demo feature of AI.
        const {marksObtained, feedBackGivenByAI = ""} = await AICorrectionService(questionDet, submissionAnswerDet.answerText);

        await EvaluationQuestion.insertOne({submissionId:submissionDet._id, questionId:questionDet._id, evaluatedMarks:marksObtained, evaluatedFeed:feedBackGivenByAI});
        return res.status(201).json({msg : "Successfully inserted into the evaluations!"});

    } catch (error) {
        error.functionName = "evaluatingAndGiveFeedbackDemo";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}

export async function InsertingTotalMarksByCalculating(req, res, next) {
    try {
        const {submissionId} = req.params;

        const result = await EvaluationQuestion.aggregate([
            {$match:{submissionId}},
            {$group: {
                _id: "$submissionId",
                totalMarks: {$sum : '$evaluatedMarks'}
            }},
        ]);
        const marksObtained = result[0]?.totalMarks || 0;
        await Evaluation.insertOne({submissionId, mockMarks:marksObtained, mockFeedback:giveMockFeed()});

    } catch (error) {
        error.functionName = "InsertingTotalMarksByCalculating";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}
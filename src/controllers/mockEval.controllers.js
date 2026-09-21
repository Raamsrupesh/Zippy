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
 * given is less (1 day), I'm just using inbuilt functions and showing demo how actually the route
 * works for the time being..
 */
export async function evaluatingAndGiveFeedbackDemo(req, res, next) {
    try {
        const {submissionAnswerId} = req.params;

        // const assignmentDet = await Assignment.findById(assignmentId);
        const submissionAnswerDet = await SubmissionAnswer.findById(submissionAnswerId);
        if(!submissionAnswerDet) return res.status(404).json({msg : "Submission answer not found."});
        const submissionDet = await Submission.findById(submissionAnswerDet.submissionId)
        if(!submissionDet) return res.status(404).json({msg : "Submission not found."});
        const questionDet = await Question.findById(submissionAnswerDet.questionId);
        if(!questionDet) return res.status(404).json({msg : "Question not found."});
        
        // The below is the demo feature of AI.
        const {marksObtained, feedBackGivenByAI = ""} = await AICorrectionService(questionDet, submissionAnswerDet.answerText);

        await EvaluationQuestion.findOneAndUpdate(
            {submissionId:submissionDet._id, questionId:questionDet._id},
            {evaluatedMarks:marksObtained, evaluatedFeed:feedBackGivenByAI},
            {upsert:true, new:true, runValidators:true}
        );
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

        const submission = await Submission.findById(submissionId);
        if(!submission) return res.status(404).json({msg : "Submission not found."});
        const evaluatedQuestions = await EvaluationQuestion.find({submissionId});
        const marksObtained = evaluatedQuestions.reduce((total, item) => total + item.evaluatedMarks, 0);
        const evaluation = await Evaluation.findOneAndUpdate(
            {submissionId},
            {assignmentId:submission.assignmentId, mockMarks:marksObtained, mockFeedback:await giveMockFeed(), status:"PENDING"},
            {upsert:true, new:true, runValidators:true}
        );
        return res.status(201).json({data:evaluation});

    } catch (error) {
        error.functionName = "InsertingTotalMarksByCalculating";
        error.statusCode = 500;
        error.msg = "Something went wrong."
        return next(error);
    }
}
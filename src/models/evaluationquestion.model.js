import mongoose from "mongoose"

const evaluationQuestionSchema = new mongoose.Schema({
    submissionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Submission",
        required:true,
        select:false
    },
    questionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Question",
        required:true,
    },
    evaluatedMarks:{
        type:Number,
        required:true
    },
    evaluatedFeed:{
        type:String
    }
});

export const EvaluationQuestion = mongoose.model("EvaluationQuestion", evaluationQuestionSchema);
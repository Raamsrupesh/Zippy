import mongoose from "mongoose"

const evaluationQuestionSchema = new mongoose.Schema({
    submissionId:{
        typs:mongoose.Schema.Types.ObjectId,
        ref:"Question",
        required:true,
        select:false
    },
    evaluatedMarks:{
        type:Number,
        required:true
    },
    evaluatedFeed:{
        type:String
    }
});

export const EvaluationQuestion = mongoose.model("Submission", evaluationQuestionSchema);
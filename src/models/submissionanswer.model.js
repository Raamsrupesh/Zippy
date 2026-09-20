import mongoose from "mongoose";

const submissionAnswerSchema = new mongoose.Schema({
    submissionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Submission",
        required:true
    },
    questionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Question",
        required:true
    },
    answerText:{
        type:String,
        required:true,
        trim:true
    }

}, {timestamps:true});

export const SubmissionAnswer = mongoose.model("SubmissionAnswer", submissionAnswerSchema);
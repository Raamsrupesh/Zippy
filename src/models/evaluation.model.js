import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema({
    submissionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Submission",
        required:true
    },
    mockMarks:{
        type:Number,
        required:true,
    },
    mockFeedback:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['APPROVED', 'PENDING'],
        required:true,
        default:"PENDING"
    }
});

export const Evaluation = mongoose.model("Evaluation", evaluationSchema);
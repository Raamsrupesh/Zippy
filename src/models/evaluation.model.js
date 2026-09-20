import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema({
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
        required:true
    },
    assignmentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Assignment",
        required:true
    },
    submissionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Submissions",
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
        required:true
    }
});

export const Evaluations = mongoose.model("Evaluation", evaluationSchema);
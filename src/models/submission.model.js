import mongoose from "mongoose";

const submissionsModel = new mongoose.Schema({
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
        required:true
    },
    assignmentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Assignment",
        required:true
    }
    
}, {timestamps:true});

export const Submission = mongoose.model("Submission", submissionsModel);
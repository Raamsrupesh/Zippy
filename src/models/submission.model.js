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
    },
    answers:{
        type:Array,
        required:true,
    }
}, {timestamps:true});

export const Submissions = mongoose.model("Submissions", submissionsModel);
import mongoose from "mongoose";

const assignmentModel = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    teacherId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Teacher",
        required:true,
        select:false
    },
    totalMarks:{
        type:Number,
        required:true
    }
},{timestamps:true});

export const Assignment = mongoose.model("Assignment", assignmentModel);
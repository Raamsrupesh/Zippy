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
    },
    batchNo:{
        type:Number,
        enum:[12345, 12344, 12346, 12347, 12348, 12349, 12350],
        required:true
    },
    status:{
        type:String,
        enum:['PENDING', 'LIVE', 'CLOSED'],
        default:"PENDING",
        required:true
    }
},{timestamps:true});

export const Assignment = mongoose.model("Assignment", assignmentModel);
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    rollNo:{
        type:String,
        required:true,
        unique:true
    },
    department:{
        type:String,
        required:true
    },
    batchNo:{
        type:Number,
        enum:[12345, 12344, 12346, 12347, 12348, 12349, 12350],
        required:true
    }
});

export const Student = mongoose.model("Student", studentSchema);
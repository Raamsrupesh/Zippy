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
    }
});

export const Student = mongoose.model("Student", studentSchema);
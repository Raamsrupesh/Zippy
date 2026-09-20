import mongoose from "mongoose";

const questionsModel = new mongoose.Schema({
    assignmentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Assignment",
        required:true,
        select:false
    },
    questionText:{
        type:String,
        required:true
    },
    maxMarks:{
        type:Number,
        required:true
    },
    markingScheme:{
        type:String,
        trim:true
    }
});


export const Question = mongoose.model("Question", questionsModel);
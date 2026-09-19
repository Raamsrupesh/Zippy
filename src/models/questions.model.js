import mongoose from "mongoose";

const questionsModel = new mongoose.Schema({
    assignmentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Assignment",
        required:true
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
        default:"COMMON"
    }
});


export const Questions = mongoose.model("Questions", questionsModel);
import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema({
    submissionId:{
        type:mongoose.Schema.Types.ObjectId,
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
        enum:['APPROVED', 'PENDING', 'NOT YET STARTED'],
        required:true
    }
})
import mongoose from "mongoose";
import argon2 from "argon2";
import { log } from "node:console";

const TeachersSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        validate:{
            validator: function(pswd){
                return pswd.startsWith('$argon')
            },
            msg:"Re-enter the password"
        }
    },
    department:{
        type:String,
        enum:['GRAMMAR AND VOCABULARY', 'SOFT SKILLS', 'SPOKEN ENGLISH'],
        required:true,
        default:"GRAMMAR AND VOCABULARY"
    }
}, 
{timestamps:1});

TeachersSchema.pre("save", async function (next){
    this.password = await argon2.hash(this.password);
    next();
})
TeachersSchema.post("save", function (doc){
    log("Recieved a teacher's data: ", doc.name)
})
export const Teacher = mongoose.model("Teacher", TeachersSchema);
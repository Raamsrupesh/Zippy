import mongoose from "mongoose";
import argon2 from "argon2";
import { log } from "node:console";

const TeachersSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        // validate:{
        //     validator: function(pswd){
        //         return pswd.startsWith('$argon')
        //     },
        //     msg:"Re-enter the password"
        // },
        select:false
    },
    department:{
        type:String,
        enum:['GRAMMAR AND VOCABULARY', 'SOFT SKILLS', 'SPOKEN ENGLISH'],
        required:true,
        default:"GRAMMAR AND VOCABULARY"
    },
    batchNo:{
        type:Array,
        required:true
    }
}, 
{timestamps:true});

// TeachersSchema.pre("save", async function (next){
//     if (!this.isModified("password")) {
//     return next();
//   }

//   try {
//     this.password = await argon2.hash(this.password);
//     next();
//   } catch (error) {
//     next(error);
//   }
// })
TeachersSchema.post("save", function (doc){
    log("Recieved a teacher's data: ", doc.name)
})
export const Teacher = mongoose.model("Teacher", TeachersSchema);
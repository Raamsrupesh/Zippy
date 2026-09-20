import {Teacher} from '../models/teachers.model.js';
export async function isTeacherAuthorizedForThisBatch(teacherId, batchNo) {
    const teacherDet = await Teacher.findById(teacherId);
    if(teacherDet.batchNo.includes(batchNo)){
        return true;
    }
    return false;
}
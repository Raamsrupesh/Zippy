import z from 'zod';

export const teacherInsertionValidations = z.object({
    name:z.string().trim().min(3, {message : "The name should be atleast of 3 characters."}),
    email:z.string().email(),
    password:z.string().trim().min(8, {message:"Password should be atleast 8 charcters."}),
    department:z.string().trim(),
    batchNo:z.array().nonempty()
});
import z from 'zod';

export const studentInsertionValidations = z.object({
    name:z.string().trim().min(3, {message : "The name should be atleast of 3 characters."}),
    email:z.string().email(),
    rollNo:z.string().trim().min(8, {message:"RollNo should be of 8 charcters."}),
    department:z.string().trim(),
    batchNo:z.int()
});
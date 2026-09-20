import z from 'zod';

export const assignmentInsertionValidations = z.object({
    title: z.string().trim().min(3, {message:"The title should've  min 3 characters."}).max(20, " Title shouldn't go beyond 20 characters."),
    descrption: z.string().trim().min(5, " Description should have at least five characters").max(30, " Description shouldn't go beyond 30 characters."),
    teacherId:z.string().trim(),
    totalMarks:z.int(),
    batchNo:z.int(),
    status:z.string()
})
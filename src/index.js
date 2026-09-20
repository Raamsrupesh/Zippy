import express from "express";
import teacherRouter from './routes/teacher.route.js';
import studentRouter from './routes/student.route.js';
import {teachersMiddleware} from './middlewares/teachers.middleware.js'
import {studentMiddleware} from './middlewares/student.middleware.js'
import { log } from "node:console";
const app = express();

app.use(express.json());
app.use('/teacher', teachersMiddleware, teacherRouter);
app.use('/student', studentMiddleware, studentRouter);


app.use((err, req, res, next) => {
  const statusCode = err.statusCode ?? 500;
  const functionName = err.functionName ?? 'unknown';

  log(
    `Error details: ${err.message || err} | statusCode: ${statusCode} | function: ${functionName}`,
    { err, stack: err.stack }
  );

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    functionName
  });
});

export default app;
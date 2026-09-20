# Sitaraam API

An Express and MongoDB API for managing teachers, students, assignments, questions, submissions, and evaluations.

## Features

- MongoDB connection through Mongoose.
- Teacher assignment and question management.
- Student assignment viewing and answer submission.
- Teacher and student role checks through request headers.
- Central JSON error responses.
- Assignment status flow: `PENDING`, `LIVE`, and `CLOSED`.

## Requirements

- Node.js 18 or newer.
- A MongoDB Atlas cluster or another MongoDB server.
- A MongoDB database user with access to the selected database.

## Setup

Install dependencies:

```powershell
npm install
```

Create a `.env` file in the project root:

```env
DATABASE_URL=mongodb://username:password@host1:27017,host2:27017,host3:27017/?ssl=true&replicaSet=your-replica-set&authSource=admin&appName=Cluster0
```

Keep `.env` private and do not commit database credentials. If the password contains characters such as `@`, `:`, `/`, or `#`, URL-encode the password.

Start the API:

```powershell
npm run r
```

The API runs at:

```text
http://localhost:3000
```

Use `http`, not `https`, unless TLS is configured separately.

## Thunder Client Headers

### Teacher requests

```text
role: TEACHER
teacherId: <teacher MongoDB ObjectId>
```

### Student requests

```text
role: STUDENT
studentId: <student MongoDB ObjectId>
```

For JSON requests, set `Content-Type` to `application/json` and use the JSON body examples below.

## Teacher API

All teacher routes start with `/teacher`.

| Method | Path | Purpose | Success |
| --- | --- | --- | --- |
| POST | `/teacher/create` | Create a teacher | `201` |
| POST | `/teacher/createAssignment` | Create an assignment for an authorized batch | `201` |
| GET | `/teacher/assignment/:assignmentId` | Get one assignment | `200` |
| PUT | `/teacher/assignment/:assignmentId` | Update an assignment | `200` |
| DELETE | `/teacher/assignment/:assignmentId` | Delete an assignment | `200` |
| POST | `/teacher/assignment/:assignmentId/postQuestion` | Add questions to an assignment | `201` |
| POST | `/teacher/:questionId` | Get one question | `200` |
| PATCH | `/teacher/questiontext/:questionId` | Update question text | `200` |
| PATCH | `/teacher/questionmarks/:questionId` | Update maximum marks | `200` |
| PATCH | `/teacher/questionMS/:questionId` | Update marking scheme | `200` |
| PATCH | `/teacher/question/:questionId` | Update the complete question | `200` |
| DELETE | `/teacher/:questionId` | Delete a question | `200` |
| GET | `/teacher/assignment/answers/:assignmentId` | View answers for an assignment | `200` |
| GET | `/teacher/assignment/compareQAs/:submissionId` | Compare questions and answers | `200` |
| GET | `/teacher/assignment/compareQAswithEval/:submissionId` | Compare questions, answers, and evaluations | `200` |

Example assignment body:

```json
{
  "title": "Grammar test",
  "description": "Complete all questions.",
  "totalMarks": 20,
  "batchNo": 12345
}
```

Example question body:

```json
{
  "questionsDetails": [
    {
      "questionText": "Write a sentence using a conjunction.",
      "maxMarks": 5,
      "markingScheme": "Grammar and meaning"
    }
  ]
}
```

## Student API

All student routes start with `/student`.

| Method | Path | Purpose | Success |
| --- | --- | --- | --- |
| GET | `/student/viewassignments` | View live assignments for the student's batch | `200` |
| GET | `/student/viewassignment/:assignmentId` | View one assignment in the student's batch | `200` |
| POST | `/student/answerassignment/:assignmentId/:questionId` | Submit an answer | `201` |

Example answer body:

```json
{
  "answerText": "This is my answer."
}
```

## Status Codes

- `200`: Existing resource was read, updated, or deleted successfully.
- `201`: A new teacher, assignment, question, or answer was created.
- `400`: Invalid request data or missing required teacher ID.
- `403`: Role or batch authorization failed.
- `404`: The requested teacher, student, assignment, question, or submission was not found.
- `409`: A student tried to answer an assignment that is not currently `LIVE`.
- `500`: Unexpected server or database error.

## Important Notes

- Start only one server on port `3000`. Starting another one causes `EADDRINUSE`.
- The API currently uses headers as simple role checks; production authentication should use signed tokens or sessions.
- The controller functions for approving evaluations, updating student marks, making assignments live, and closing assignments exist but are not currently registered in the teacher router. They are not available through Thunder Client until routes and their evaluation data contract are added.

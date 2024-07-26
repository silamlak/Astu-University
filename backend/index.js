import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import applicantRoute from './router/applicantRoute.js'
import collegeRoute from './router/collegeRoute.js'
import departmentRoute from './router/departmentRoute.js'
import studentRoute from './router/studentRoute.js'

const app = express()

app.use('/files', express.static('files'))
dotenv.config()
app.use(express.urlencoded({extended: true}))
app.use(express.json({extended: true}))
// const corsOptions = {
//   origin: "http://localhost:5173", // Update to match your frontend's origin
//   credentials: true, // Allow credentials (cookies) to be included
// };

app.use(cors());
app.use(cookieParser())
app.use(bodyParser.json())

app.use('/api/applicant', applicantRoute)
app.use("/api/college", collegeRoute);
app.use("/api/department", departmentRoute);
app.use("/api/student", studentRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || 'server error'
    res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
    })
})

app.listen(process.env.PORT, () => {
    console.log(`server is running on ${process.env.PORT}`);
    mongoose.connect(process.env.MONGODB)
    .then(() => console.log('db connected'))
    .catch((err) => console.log(err))
})
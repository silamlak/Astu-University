import mongoose from "mongoose";

const collegeSchema = mongoose.Schema({
    email: String,
    password: String,
})

export default mongoose.model('College', collegeSchema)
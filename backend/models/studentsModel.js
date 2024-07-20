import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,   
        required: true,
        },
})

export default mongoose.model('Students', studentSchema)
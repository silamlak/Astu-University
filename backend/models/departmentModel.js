import mongoose from 'mongoose'

const department = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
}, {timestamps: true})

export default mongoose.model('Departments', department)
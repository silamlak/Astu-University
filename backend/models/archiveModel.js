import mongoose from 'mongoose'

const archiveSchema = new mongoose.Schema({
    applied_id: {
        type: String,
        required: true
    },
    student_id: {
        type: String,
        required: true
    },
    file_id: {
        type: Array,
        required: true
    },
    duration_id: {
        type: String,
        required: true
    },
})

export default mongoose.model('Archive', archiveSchema)
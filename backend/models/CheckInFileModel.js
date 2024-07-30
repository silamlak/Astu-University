import mongoose from "mongoose";

const checkInSchema = new mongoose.Schema(
  {
    student_id: {
      type: String,
    },
    checkIn_file: {
      type: String,
    },
    checkIn_status: {
        type: String,
        default: 'Not-Set'
    },
    time_to_checkIn: {
      type: Date
    },
  },
  { timestamps: true }
);

export default mongoose.model("CheckinFiles", checkInSchema);

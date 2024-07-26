import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  applyied_id: {
    type: String,
    required: true,
  },
  duration_year: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Students", studentSchema);

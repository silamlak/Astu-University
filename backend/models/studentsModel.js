import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
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
    duration_id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "learning",
    },
    checkin_file: {
      type: Array,
      default: [],
    },
    file: {
      type: String,
    },
    finished_file: {
      type: String,
    },
    archive:{
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Students", studentSchema);
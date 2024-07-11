import mongoose from "mongoose";

const applicantForm = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    phone_no: {
      type: String,
      required: true,
    },
    attached_file: {
      type: String,
      required: true,
    },
    department_status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    college_status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    confirmation_code: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('ApplicantForms', applicantForm)
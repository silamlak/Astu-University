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
    application_type: {
      type: String,
      required: true,
    },
    level_of_application: {
      type: String,
      required: true,
    },
    university_name: {
      type: String,
      required: true,
    },
    university_location: {
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
    department_minute: {
      type: String,
    },
    college_minute: {
      type: String,
    },
    confirmation_code: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ApplicantForms", applicantForm);

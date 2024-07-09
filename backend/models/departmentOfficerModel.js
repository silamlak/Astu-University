import mongoose from "mongoose";

const departmentOffice = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone_no: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("DepartmentOffices", departmentOffice);

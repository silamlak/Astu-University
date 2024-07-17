import * as yup from "yup";

export const TITLE = "ADDIS ABABA SCIENCE AND TECHNOLOGY UNIVERSITY";
export const SUBTITLE = "College of Natural and Applied Science (CNAS)";

export const schema = yup.object().shape({
  first_name: yup.string().required("First Name is required"),
  last_name: yup.string().required("Last Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  department: yup.string().required("Department is required"),
  phone_no: yup.string().required("Phone Number is required"),
  attached_file: yup.mixed().required("File attachment is required"),
});

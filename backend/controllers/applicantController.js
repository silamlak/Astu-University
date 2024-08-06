import applicantFormModel from "../models/applicantFormModel.js";
import multer from "multer";
import util from "util";
import path from "path";
import { sendConfirmationEmail } from "../emailService.js";

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files"); // Ensure the path is correct
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + 'file.pdf';
    cb(null, uniqueSuffix);
  },
});

// Function to generate a random alphanumeric string
const generateConfirmationCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const upload = multer({ storage: storage }).single("attached_file");
const uploadPromise = util.promisify(upload);

export const applyTransfer = async (req, res, next) => {
  try {
    console.log(req.body)
    await uploadPromise(req, res);

    const {
      first_name,
      middle_name,
      title,
      gender,
      last_name,
      email,
      department,
      phone_no,
      application_type,
      level_of_application,
      university_name,
      university_location,
    } = req.body;
    const attached_file = req.file.filename;
    const confirmation_code = generateConfirmationCode();
console.log(req.body)
    const newApplicantForm = new applicantFormModel({
      first_name,
      middle_name,
      title,
      gender,
      last_name,
      email,
      department,
      phone_no,
      application_type,
      level_of_application,
      university_name,
      university_location,
      attached_file,
      confirmation_code,
    });

    const savedForm = await newApplicantForm.save();

     await sendConfirmationEmail(email, confirmation_code);

    res.status(201).json(savedForm);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "File upload error", error: err.message });
  }
};

export const checkTransfer = async (req, res, next) => {
  const {id} = req.params
  console.log(id)
  try {
    const application = await applicantFormModel.findOne({ confirmation_code: id });
    if (!application) {
      return res.status(404).json({message: 'not found'})
    }
    res.status(200).json(application)
  } catch (err) {
    next(err);
  }
};

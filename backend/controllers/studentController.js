import studentsModel from "../models/studentsModel.js";
import multer from "multer";
import util from "util";

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files"); // Ensure the path is correct
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage }).single("checkin_file");
const uploadPromise = util.promisify(upload);

export const signup = async (req, res, next) => {
  try {
    console.log(req.body);
    const student = await studentsModel.findOne({ email: req.body.email });
    if (!student) return res.status(404).json({ message: "Email not found" });
    if (req.body.password !== student.password)
      return res.status(401).json({ message: "incorrect password" });
    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

export const checkinFileUploader = async (req, res, next) => {
  try {
    console.log(req.body);
    await uploadPromise(req, res);
    const checkin_file = req.file.filename;
    const id = req.body.id;
    const student = await studentsModel.findByIdAndUpdate(
      id,
      {
        $push: { checkin_file },
      },
      { new: true }
    );
    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

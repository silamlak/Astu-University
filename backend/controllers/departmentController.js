import applicationModel from "../models/applicantFormModel.js";
import multer from "multer";
import util from "util";

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files"); // Ensure the path is correct
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + 'departmentminute.pdf';
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage }).single("department_minute");
const uploadPromise = util.promisify(upload);

export const applicationList = async (req, res, next) => {
  const role = req.headers["role"];
  console.log(role)
  try {
    const applicationList = await applicationModel
      .find()
      // .select("-email -department_status ")
      .where("department")
      .equals(role)
      .sort({ createdAt: -1 });

    res.status(201).json(applicationList);
  } catch (error) {
    next(error);
  }
};

export const applicationDetail = async (req, res, next) => {
  const { id } = req.params;
  const role = req.headers["role"];

  try {
    const applicationList = await applicationModel
      .findById(id)
      // .select("-email -department_status " )
      .where("department")
      .equals(role);
    res.status(201).json(applicationList);
  } catch (error) {
    next(error);
  }
};

export const applicationStatus = async (req, res, next) => {
  const { id } = req.params;
  console.log(req.body)
  await uploadPromise(req, res);
  console.log(id);
  const { department_status } = req.body;
   const department_minute = req.file.filename;
  console.log(department_status);
  try {
    const applicationStatus = await applicationModel.findByIdAndUpdate(
      id,
      { $set: { department_status, department_minute } },
      { new: true }
    );
    res.status(201).json(applicationStatus);
  } catch (error) {
    next(error);
  }
};

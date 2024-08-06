import studentsModel from "../models/studentsModel.js";
import multer from "multer";
import util from "util";
import durationModel from "../models/durationModel.js";
import applicantFormModel from "../models/applicantFormModel.js";
import mongoose from "mongoose";
import CheckInFileModel from "../models/CheckInFileModel.js";

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files"); // Ensure the path is correct
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + "checkin.pdf";
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
  console.log(req.body);
  const id = req.headers["id"];
  const _id = req.headers["_id"];
  console.log(id, _id);
  try {
    await uploadPromise(req, res);
    const checkIn_file = req.file.filename;
    console.log(checkIn_file);
    const fileChecked = await CheckInFileModel.findByIdAndUpdate(_id, {
      $set: { checkIn_file, checkIn_status: "Not-Seen" },
    });

    const student = await studentsModel.findByIdAndUpdate(
      id,
      {
        $push: { checkin_file: _id },
      },
      { new: true }
    );
    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

export const checkinFilePage = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.body;
    // console.log(req.body);

    // Fetch student by ID within the transaction
    const student = await studentsModel.findById(id).session(session);
    if (!student) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Student not found" });
    }

    const d_id = student.duration_id;
    const apply_id = student.applyied_id;

    // Fetch duration and application data within the transaction
    const duration = await durationModel.findById(d_id).session(session);
    const application = await applicantFormModel
      .findById(apply_id)
      .session(session);

    if (!duration || !application) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "Duration or application not found" });
    }

    // Extract dates from duration
    const fromDate = new Date(duration.from);
    const toDate = new Date(duration.to);

    // Calculate the year gap between from and to dates
    let yearGap = toDate.getFullYear() - fromDate.getFullYear();
    if (
      toDate.getMonth() < fromDate.getMonth() ||
      (toDate.getMonth() === fromDate.getMonth() &&
        toDate.getDate() < fromDate.getDate())
    ) {
      yearGap--;
    }
    // console.log(`Year gap: ${yearGap + 1} years`);

    // Calculate file duration gap based on application type
    let file_duration_gap;
    if (application.application_type === "Local") {
      file_duration_gap = (yearGap + 1) * 2;
    } else {
      file_duration_gap = yearGap + 1;
    }
    // console.log(file_duration_gap);

    // Calculate end dates based on the application type
    let intervalDates = [];
    let currentDate = new Date(fromDate);
    let intervalLength = application.application_type === "Int" ? 6 : 12; // 6 months for Local, 12 months for International
    let endDate = new Date(fromDate);
    endDate.setMonth(endDate.getMonth() + intervalLength);

    while (endDate <= toDate) {
      intervalDates.push(new Date(endDate)); // Store only the end date

      // Move to the next interval
      currentDate = new Date(endDate);
      endDate.setMonth(endDate.getMonth() + intervalLength);
    }

    // Handle the case where the last interval endDate might be before toDate
    if (currentDate < toDate) {
      intervalDates.push(new Date(toDate));
    }

    const ifThere = await CheckInFileModel.findOne({ student_id: id }).session(
      session
    );

    if (!ifThere) {
      // Save each date from intervalDates to CheckInFileModel
      const checkInFileEntries = intervalDates.map((date) => ({
        student_id: id,
        time_to_checkIn: date,
      }));

      await CheckInFileModel.insertMany(checkInFileEntries, { session });
    }

    // console.log("Interval end dates:", intervalDates);

    const findDates = await CheckInFileModel.find({ student_id: id }).session(
      session
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    // Send the response with the calculated gap
    res.status(200).json(findDates);
  } catch (error) {
    // Abort the transaction and handle errors
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// Helper function to calculate the difference between two dates
const calculateDateDifference = (fromDate, toDate) => {
  let years = toDate.getFullYear() - fromDate.getFullYear();
  let months = toDate.getMonth() - fromDate.getMonth();
  let days = toDate.getDate() - fromDate.getDate();

  if (days < 0) {
    months--;
    days += new Date(toDate.getFullYear(), toDate.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
};

export const remainingPage = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  console.log(req.body);

  try {
    const { id } = req.body;

    // Fetch student by ID within the transaction
    const student = await studentsModel.findById(id).session(session);
    if (!student) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Student not found" });
    }

    const d_id = student.duration_id;

    // Fetch duration and application data within the transaction
    const duration = await durationModel.findById(d_id).session(session);
    if (!duration) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Duration not found" });
    }

    const fromDate = new Date(); // Current date and time
    const toDate = new Date(duration.to); // End date

    // Calculate the remaining time
    const remainingTime = calculateDateDifference(fromDate, toDate);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Send the response with the calculated remaining time
    res.status(200).json({ remainingTime });
  } catch (error) {
    // Abort the transaction and handle errors
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

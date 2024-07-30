import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import util from "util";

import departmentModel from "../models/departmentModel.js";
import departmentOfficerModel from "../models/departmentOfficerModel.js";
import collegeModel from "../models/collegeModel.js";
import applicationModel from "../models/applicantFormModel.js";
import studentsModel from "../models/studentsModel.js";
import durationModel from "../models/durationModel.js";
import CheckInFileModel from "../models/CheckInFileModel.js";

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

const upload = multer({ storage: storage }).single("college_minute");
const uploadPromise = util.promisify(upload);

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    console.log(req.body);

    let user =
      (await departmentOfficerModel.findOne({ email })) ||
      (await collegeModel.findOne({ email }));

    if (!user) return res.status(400).json({ message: "Invalid email" });
    if (password !== user.password)
      return res.status(400).json({ message: "Invalid password" });
    const accessToken = jwt.sign(
      {
        user: {
          id: user._id,
          role: user?.department,
        },
      },
      process.env.JWT,
      { expiresIn: "1m" }
    );

    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "1d",
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      // secure: true,
      sameSite: "none",
    });

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies.jwt) return res.status(401).json({ message: "unauthorizeds" });
  const refreshToken = cookies.jwt;
  jwt.verify(refreshToken, process.env.JWT, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "forbidden" });
    const foundOfficer = await departmentOfficerModel.findById({
      _id: decoded.id,
    });
    if (!foundOfficer) return res.status(401).json({ message: "unauthorized" });
    const accessToken = jwt.sign(
      {
        officer: {
          id: foundOfficer._id,
          role: foundOfficer.department,
        },
      },
      process.env.JWT,
      { expiresIn: "1m" }
    );
    res.json({ accessToken });
  });
};

export const logout = async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies.jwt) return res.status(401).json({ message: "unauthorized" });
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.json({ message: "jwt cleared" });
};

export const addDepartment = async (req, res, next) => {
  try {
    const newDepartment = new departmentModel(req.body);
    await newDepartment.save();
    res.status(201).json({ message: "new department added" });
  } catch (error) {
    next(error);
  }
};

export const addDepartmentOfficer = async (req, res, next) => {
  try {
    const newDepartment = new departmentOfficerModel(req.body);
    await newDepartment.save();
    res.status(201).json({ message: "new departmentOfficer added" });
  } catch (error) {
    next(error);
  }
};

export const addCollegeOfficer = async (req, res, next) => {
  try {
    const newDepartment = new collegeModel(req.body);
    await newDepartment.save();
    res.status(201).json({ message: "new collegeOfficer added" });
  } catch (error) {
    next(error);
  }
};

export const applicationList = async (req, res, next) => {
  try {
    const applicationList = await applicationModel
      .find()
      // .select("-email -department_status ")
      .where("department_status")
      .equals("approved")
      .sort({ createdAt: -1 });
    res.status(201).json(applicationList);
  } catch (error) {
    next(error);
  }
};

export const applicationDetail = async (req, res, next) => {
  const { id } = req.params;
  try {
    const applicationList = await applicationModel
      .findById(id)
      // .select("-email -department_status ")
      .where("department_status")
      .equals("approved");
    res.status(201).json(applicationList);
  } catch (error) {
    next(error);
  }
};

export const applicationStatus = async (req, res, next) => {
  const { id } = req.params;
  await uploadPromise(req, res);
  const { college_status } = req.body;
  const college_minute = req.file.filename;

  try {
    const applicationStatus = await applicationModel
      .findByIdAndUpdate(
        id,
        { $set: { college_status, college_minute } },
        { new: true }
      )
      // .select("-email -department_status ")
      .where("department_status")
      .equals("approved");
    res.status(201).json(applicationStatus);
  } catch (error) {
    next(error);
  }
};

export const createStudent = async (req, res, next) => {
  console.log(req.body);
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

  const upload = multer({ storage: storage }).single("file");
  const uploadP = util.promisify(upload);
  await uploadP(req, res);

  const { email, password, applyied_id, to, from } = req.body;
  const file = req.file.filename;

  const session = await studentsModel.startSession();
  session.startTransaction();

  try {
    // Step 1: Create a new student
    const newDuration = new durationModel({
      to,
      from,
    });

    const duration = await newDuration.save({ session });
    // Step 1: Create a new student
    const newStudent = new studentsModel({
      duration_id: duration._id,
      email,
      password,
      applyied_id,
      file,
    });
    await newStudent.save({ session });

    // Step 2: Update applicationModel with the new student ID
    const id = req.body.applyied_id; // Assuming you pass the applied ID in the request body
    const up = await applicationModel.findByIdAndUpdate(
      id,
      { $set: { student_id: newStudent._id } },
      { session }
    );
    console.log(up);

    await session.commitTransaction();
    session.endSession();

    res
      .status(201)
      .json({ message: "New student created and application updated" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    let user =
      (await departmentOfficerModel.findById(id)) ||
      (await collegeModel.findById(id));

    if (!user) return res.status(400).json({ message: "user not found" });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    let user =
      (await departmentOfficerModel.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      )) ||
      (await collegeModel.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      ));

    if (!user) return res.status(400).json({ message: "User not found" });

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const fetchapprovedUser = async (req, res, next) => {
  try {
    const users = await applicationModel.find({
      college_status: "approved",
      student_id: { $exists: false },
    });
    if (!users) return res.status(404).json({ message: "not found" });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const studentList = async (req, res, next) => {
  try {
    // Fetch all students
    const students = await studentsModel.find().sort({ createdAt: -1 }).lean(); // Using .lean() to get plain JavaScript objects

    // Fetch applications for each student
    const studentListWithApplications = await Promise.all(
      students.map(async (student) => {
        // Fetch applications for the current student
        const applications = await applicationModel
          .find({ _id: student.applyied_id })
          .lean(); // Using .lean() to get plain JavaScript objects

        // Return student with applications
        return {
          ...student,
          applications: applications[0], // Nest applications inside the student object
        };
      })
    );

    // Respond with the list of students and their corresponding applications
    res.status(200).json(studentListWithApplications);
  } catch (error) {
    next(error);
  }
};

export const StudentDetail = async (req, res, next) => {
  const { id } = req.params;
  try {
    const studentDetail = await studentsModel.findById(id);
    const cad = await applicationModel.find({
      _id: studentDetail.applyied_id,
    });
    const cads = await durationModel.find({
      _id: studentDetail.duration_id,
    });

        const checkinFiles = await CheckInFileModel.find({
          _id: { $in: studentDetail.checkin_file },
        });

    const studentDetailWithApplication = {
      ...studentDetail._doc,
      application: cad[0],
      duration: cads[0],
      checkin_files: checkinFiles
    };
    res.status(200).json(studentDetailWithApplication);
  } catch (error) {
    next(error);
  }
};

export const studentRenewal = async (req, res, next) => {
  console.log(req.body);

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./files");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + file.originalname;
      cb(null, uniqueSuffix);
    },
  });

  const upload = multer({ storage: storage }).single("attached_file");
  const uploadP = util.promisify(upload);
let session
  try {
    // Start a session
    session = await durationModel.startSession();
    session.startTransaction();

    await uploadP(req, res);

    const { from_date, to_date, id } = req.body;
    const update_file = req.file.filename;

    const cads = await durationModel.findById(id).session(session);
    if (!cads) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Not found" });
    }
    if (cads.previousDurations.length >= 2) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Maximum Limit Reched" });
    }

    const renew = await durationModel
      .findByIdAndUpdate(id, {
        $push: {
          previousDurations: { from: cads.from, to: cads.to },
          update_file,
        },
      })
      .session(session);

    const renewal = await durationModel
      .findByIdAndUpdate(id, {
        $set: {
          from: from_date,
          to: to_date,
        },
        $inc: {
          max_limit: 1, 
        },
      })
      .session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json(renewal);
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    next(error);
  }
};

export const checkinFileStatus = async (req, res, next) => {
  console.log(req.body);
  const {id} = req.body
  try {

    const renew = await CheckInFileModel.findByIdAndUpdate(id, {
      $set: {
        checkIn_status: 'Seen',
      },
    })

    res.status(200).json(renew);
  } catch (error) {
    next(error);
  }
};

export const studentStatus = async (req, res, next) => {
  const id = req.headers["id"];
  const status = req.headers["status"];
  console.log(id, status);
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "./files");
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + file.originalname;
        cb(null, uniqueSuffix);
      },
    });

    const upload = multer({ storage: storage }).single("file");
    const uploadP = util.promisify(upload);
  try {
        await uploadP(req, res);
        const finished_file = req.file.filename;
        console.log(finished_file)

    const renew = await studentsModel.findByIdAndUpdate(id, {
      $set: {
        finished_file,
        status,
      },
    });

    res.status(200).json(renew);
  } catch (error) {
    next(error);
  }
};

export const allDepartmentOfficer = async (req, res, next) => {
  try {
    const depOfficer = await departmentOfficerModel.find()
    res.status(200).json(depOfficer) 
  } catch (error) {
    next(error)
  }
}

export const DepartmentOfficerUpdate = async (req, res, next) => {
  const {id} = req.params
  console.log(id)
  try {
    const depOfficer = await departmentOfficerModel.findByIdAndUpdate(id, {$set: req.body})
    res.status(200).json(depOfficer) 
  } catch (error) {
    next(error)
  }
}

export const DepartmentOfficerDelete = async (req, res, next) => {
  const {id}= req.params
  try {
    const depOfficer = await departmentOfficerModel.findByIdAndDelete(id)
    res.status(200).json({message: 'deleted success'}) 
  } catch (error) {
    next(error)
  }
}



export const allDepartment = async (req, res, next) => {
  try {
    const dep = await departmentModel.find()
    res.status(200).json(dep) 
  } catch (error) {
    next(error)
  }
}

export const DepartmentUpdate = async (req, res, next) => {
  const { id } = req.params;
  console.log(req.body);
  try {
    const depOfficer = await departmentModel.findByIdAndUpdate(id, {
      $set: req.body,
    });
    res.status(200).json(depOfficer);
  } catch (error) {
    next(error);
  }
};

export const DepartmentDelete = async (req, res, next) => {
  const {id} = req.params;
  console.log(id)
  try {
    const depOfficer = await departmentModel.findByIdAndDelete(id);
    res.status(200).json({ message: "deleted success" });
  } catch (error) {
    next(error);
  }
};
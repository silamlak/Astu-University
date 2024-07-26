import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import util from "util";

import departmentModel from "../models/departmentModel.js";
import departmentOfficerModel from "../models/departmentOfficerModel.js";
import collegeModel from '../models/collegeModel.js'
import applicationModel from '../models/applicantFormModel.js'
import studentsModel from "../models/studentsModel.js";

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
    console.log(req.body)

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
          role: user?.department
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

    res.json({accessToken})

  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
    const cookies = req.cookies
    if (!cookies.jwt) return res.status(401).json({message: 'unauthorizeds'})
        const refreshToken = cookies.jwt
    jwt.verify(refreshToken, process.env.JWT, async (err, decoded) => {
        if (err) return res.status(403).json({message: 'forbidden'})
            const foundOfficer = await departmentOfficerModel.findById({_id: decoded.id})
        if(!foundOfficer) return res.status(401).json({message: 'unauthorized'})
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
                res.json({accessToken})
    })
}

export const logout = async (req, res, next) => {
    const cookies = req.cookies
    if(!cookies.jwt) return res.status(401).json({ message: "unauthorized" });
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })
    res.json({message: 'jwt cleared'})
}

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
  const {id}= req.params
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
  const {id}= req.params
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
  // console.log(req.body);
  const session = await studentsModel.startSession();
  session.startTransaction();
  try {
    // Step 1: Create a new student
    const newStudent = new studentsModel(req.body);
    await newStudent.save({ session });

    // Step 2: Update applicationModel with the new student ID
    const id = req.body.applyied_id // Assuming you pass the applied ID in the request body
    console.log(_id)
    const up = await applicationModel.findByIdAndUpdate(_id,
      { $set: { student_id: newStudent._id } },
      { session }
    );
    console.log(up)

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
    const {id} = req.params

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

export const fetchapprovedUser = async(req, res, next) => {
  try {
        const users = await applicationModel.find({
          department_status: "approved",
          student_id: { $exists: false },
        });
        if(!users) return res.status(404).json({message: 'not found'})
         res.status(200).json(users);
  } catch (error) {
    next(error)
  }
}


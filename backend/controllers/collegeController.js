import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import departmentModel from "../models/departmentModel.js";
import departmentOfficerModel from "../models/departmentOfficerModel.js";
import collegeModel from '../models/collegeModel.js'
import applicationModel from '../models/applicantFormModel.js'

export const signin = async (req, res, next) => {
  const { email, password, role } = req.body;
  try {
    console.log(req.body)
    let user

    if (role === "Department") {
      user = await departmentOfficerModel.findOne({ email });
    } else if (role === 'College' ) {
      user = await collegeModel.findOne({ email });
    }

    if (!user) return res.status(400).json({ message: "Invalid email" });
    if (password !== user.password)
      return res.status(400).json({ message: "Invalid password" });
    const accessToken = jwt.sign(
      {
        user: {
          id: user._id,
          role: user.department || ''
        },
      },
      process.env.JWT,
      { expiresIn: "10s" }
    );

    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "1d",
    });

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        // secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
    })

    res.json({accessToken})

  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res) => {
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
                  { expiresIn: "10s" }
                );
                res.json({accessToken})
    })
}

export const logout = async (req, res) => {
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
      .equals("approved");
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
  const {college_status} = req.body
  try {
    const applicationStatus = await applicationModel
      .findByIdAndUpdate(
        id,
        { $set: { college_status } },
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

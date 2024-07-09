import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import departmentModel from "../models/departmentModel.js";
import departmentOfficerModel from "../models/departmentOfficerModel.js";

export const signin = async (req, res, next) => {
  try {
    console.log(req.body)
    const { email, password } = req.body;
    let officer = await departmentOfficerModel.findOne({ email });
    if (!officer) return res.status(400).json({ message: "Invalid email" });
    if (password !== officer.password)
      return res.status(400).json({ message: "Invalid password" });
    const accessToken = jwt.sign(
      {
        officer: {
          id: officer._id,
          role: officer.department,
        },
      },
      process.env.JWT,
      { expiresIn: "10s" }
    );

    const refreshToken = jwt.sign(
        {id: officer._id},
        process.env.JWT,
        { expiresIn: "1d" }
    )

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

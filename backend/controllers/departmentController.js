import applicationModel from "../models/applicantFormModel.js";

export const applicationList = async (req, res, next) => {
  const role = req.headers["role"];
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
  console.log(id);
  const { department_status, department_minute } = req.body;
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

import applicantFormModel from '../models/applicantFormModel.js'

export const applyTransfer = async (req, res, next) => {
  try {
    console.log(req.body)
    const applicationForm = new applicantFormModel(req.body)
    await applicationForm.save()
    res.status(201).json({message: 'application recieved'})
  } catch (err) {
    next(err);
  }
};

export const checkTransfer = (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

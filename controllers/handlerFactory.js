const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const deleteOne = (Model, modelName) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);

    if (!doc)
      return next(new AppError(`No ${modelName} found with that ID`, 404));

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

const updateOne = (Model, modelName) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc)
      return next(new AppError(`No ${modelName} found with that ID`, 404));

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

module.exports = { deleteOne, updateOne };

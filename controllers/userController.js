const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { deleteOne, updateOne } = require("./handlerFactory");

function filterObj(obj, ...allowedFields) {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
}

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    result: users.length,
    data: {
      users,
    },
  });
});

const updateMe = catchAsync(async (req, res, next) => {
  // create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        "This route is not for password updates. please use /updateMyPassword",
        400
      )
    );

  // filtered out unwanted fields name that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");

  // update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    message: "success",
    data: {
      user: updatedUser,
    },
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: {
      user: null,
    },
  });
});

const getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

// DO NOT UPDATE PASSWORDS WITH THIS
const updateUser = updateOne(User, "user");

const deleteUser = deleteOne(User, "user");

// const updateUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "This route is not yet defined",
//   });
// };

// const deleteUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "This route is not yet defined",
//   });
// };

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
};

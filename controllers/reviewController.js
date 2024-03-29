const Review = require("./../models/reviewModel");
// const catchAsync = require("../utils/catchAsync");
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlerFactory");

// const getAllReviews = catchAsync(async (req, res, next) => {
//   console.log(req.params);
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };

//   const reviews = await Review.find(filter);

//   res.status(200).json({
//     status: "success",
//     result: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

const getAllReviews = getAll(Review);

const setTourUserId = (req, res, next) => {
  // allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// const createReview = catchAsync(async (req, res, next) => {
//   const newReview = await Review.create(req.body);

//   res.status(200).json({
//     status: "success",
//     data: {
//       review: newReview,
//     },
//   });
// });

const getReview = getOne(Review, undefined, "review");
const createReview = createOne(Review);
const updateReview = updateOne(Review, "review");
const deleteReview = deleteOne(Review, "review");

module.exports = {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserId,
  getReview,
};

const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/ApiFeatures");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { deleteOne } = require("./handlerFactory");

const aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

const getAllTours = catchAsync(async (req, res, next) => {
  // try {
  // // build the query
  // const queryObj = { ...req.query };
  // const excludedFields = ["page", "sort", "limit", "fields"];
  // excludedFields.forEach((el) => delete queryObj[el]);

  // // 1) advanced filtering
  // let queryString = JSON.stringify(queryObj);
  // queryString = queryString.replace(
  //   /\b(gte|gt|lte|lt)\b/g,
  //   (match) => `$${match}`
  // );

  // let query = Tour.find(JSON.parse(queryString));

  // 2) sort
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(",").join(" ");
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort("-createdAt");
  // }

  // 3) field limiting
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(",").join(" ");
  //   query = query.select(fields);
  // } else {
  //   query = query.select("-__v");
  // }

  // 4) pagination
  // const page = +req.query.page || 1;
  // const limit = +req.query.limit || 100;
  // const skip = (page - 1) * limit;

  // query = query.skip(skip).limit(limit);

  // if (req.query.page) {
  //   const numTours = await Tour.countDocuments();
  //   if (skip >= numTours) throw new Error("This page doesn't exist");
  // }

  // execute the query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;
  // const tours = await query;

  // send response
  res.status(200).json({
    status: "success",
    result: tours.length,
    data: {
      tours,
    },
  });
  // } catch (error) {
  //   res.status(404).json({
  //     status: "error",
  //     message: error.message,
  //   });
  // }
});

const createTour = catchAsync(async (req, res, next) => {
  // try {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: "error",
  //     message: err,
  //   });
  // }
});

const getTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  // try {
  const tour = await Tour.findById(id).populate("reviews");

  if (!tour) return next(new AppError("No tour found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
  // } catch (error) {
  //   res.status(404).json({
  //     status: "error",
  //     message: error.message,
  //   });
  // }
});

const updateTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  // try {
  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) return next(new AppError("No tour found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
  // } catch (error) {
  //   res.status(404).json({
  //     status: "error",
  //     message: "Invalid data sent",
  //   });
  // }
});

const deleteTour = deleteOne(Tour, "tour");

// const deleteTour = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   // try {
//   const tour = await Tour.findByIdAndDelete(id);

//   if (!tour) return next(new AppError("No tour found with that ID", 404));

//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
//   // } catch (error) {
//   //   res.status(404).json({
//   //     status: "error",
//   //     message: error,
//   //   });
//   // }
// });

const getTourStats = catchAsync(async (req, res, next) => {
  // try {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    { $sort: { minPrice: +1 } },
    // { $match: { _id: { $ne: "EASY" } } },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
  // } catch (error) {
  //   res.status(404).json({
  //     status: "error",
  //     message: error,
  //   });
  // }
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  // try {
  const year = +req.params.year;

  const plan = await Tour.aggregate([
    { $unwind: "$startDates" },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: +1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStart: -1 },
    },
    { $limit: 12 },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
  // } catch (error) {
  //   res.status(404).json({
  //     status: "error",
  //     message: error,
  //   });
  // }
});

module.exports = {
  getAllTours,
  createTour,
  deleteTour,
  getTour,
  updateTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
};

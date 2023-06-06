const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");

const getOverview = catchAsync(async (req, res, next) => {
  // Get tour data from collection
  const tours = await Tour.find();

  res.status(200).render("overview", {
    title: "All tours",
    tours,
  });
});

const getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  res.status(200).render("tour", {
    title: `${tour.name} tour`,
    tour,
  });
});

const getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render("login", {
    title: "Login to your account",
  });
});

module.exports = { getOverview, getTour, getLoginForm };

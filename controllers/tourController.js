const Tour = require("../models/tourModel");

const getAllTours = async (req, res) => {
  try {
    // build the query
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const query = Tour.find(queryObj);

    // execute the query
    const tours = await query;

    // send response
    res.status(200).json({
      status: "success",
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: "Invalid data sent",
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: "Invalid data sent",
    });
  }
};

const getTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findById(id);
    if (!tour) throw new Error("can't find tour");
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error,
    });
  }
};

const updateTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: "Invalid data sent",
    });
  }
};

const deleteTour = async (req, res) => {
  const { id } = req.params;
  try {
    await Tour.findByIdAndDelete(id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error,
    });
  }
};

module.exports = {
  getAllTours,
  createTour,
  deleteTour,
  getTour,
  updateTour,
};

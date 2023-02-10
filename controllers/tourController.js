const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const checkId = (req, res, next) => {
  const { id } = req.params;
  if (+id > tours.length)
    return res.status(404).json({
      status: "fail",
      message: "invalid id",
    });
  next();
};

const checkBody = (req, res, next) => {
  const { body } = req;
  if (!body.name || !body.price)
    return res.status(400).json({
      status: "fail",
      message: "missing name or price",
    });

  next();
};

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    result: tours.length,
    data: {
      tours,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: `Updated tour`,
    },
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};

const getTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((tour) => tour.id === +id);

  if (!tour)
    return res.status(404).json({
      status: "fail",
      message: "Invalid! We cannot find a tour with that id",
    });

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

module.exports = {
  getAllTours,
  createTour,
  deleteTour,
  getTour,
  updateTour,
  checkId,
  checkBody,
};

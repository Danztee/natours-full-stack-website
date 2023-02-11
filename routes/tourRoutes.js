const express = require("express");
const router = express.Router();
const {
  checkBody,
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkId,
} = require("../controllers/tourController");

router.param("id", checkId);

router.route("/").get(getAllTours).post(checkBody, createTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;

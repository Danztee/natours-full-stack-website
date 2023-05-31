const express = require("express");
const { protect, restrictTo } = require("../controllers/authController");

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require("../controllers/tourController");

const { createReview } = require("./../controllers/reviewController");
const reviewRouter = require("./../routes/reviewRoutes");

const router = express.Router();

router.use("/:tourId/reviews", reviewRouter);

// router.param("id", checkId);
router.route("/top-5-tours").get(aliasTopTours, getAllTours);
router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);

router.route("/").get(protect, getAllTours).post(createTour);
router
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

router
  .route("/:tourId/reviews")
  .post(protect, restrictTo("user"), createReview);

module.exports = router;

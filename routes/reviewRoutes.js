const express = require("express");
const { protect, restrictTo } = require("../controllers/authController");
const {
  createReview,
  getAllReviews,
  deleteReview,
  updateReview,
} = require("../controllers/reviewController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user"), createReview);

router.route("/:id").patch(updateReview).delete(deleteReview);

module.exports = router;
